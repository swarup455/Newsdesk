import admin from "../utils/firebaseAdmin.js"
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const googleLogin = asyncHandler(async (req, res) => {
    const auth = req.headers.authorization;
    //taking token from headers
    const idToken = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    if (!idToken) throw new ApiError(401, "Missing Authorization token");
    //decoding token using firebase admin.auth()
    const decoded = await admin.auth().verifyIdToken(idToken);
    console.log(decoded)
    const { uid, email, name, picture } = decoded;

    let user = await User.findOne({ firebaseId: uid });
    if (!user) {
        user = await User.create({
            firebaseId: uid,
            fullname: name,
            email: email,
            avatar: picture
        });
    }
    return res.status(200).json({
        success: true,
        message: "Login successful",
        user
    });
});

export const registerUser = asyncHandler(async (req, res) => {
    const auth = req.headers.authorization;
    //taking token from headers
    const idToken = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    if (!idToken) throw new ApiError(401, "Missing Authorization token");
    //decoding token using firebase admin.auth()
    const decoded = await admin.auth().verifyIdToken(idToken);
    console.log(decoded)
    //destructuring datas
    const { uid, email, name, picture } = decoded

    const user = await User.create({
        firebaseId: uid,
        fullname: name,
        email: email,
        avatar: picture
    });
    return res
        .status(201)
        .json({
            success: true,
            message: "User registered successfully",
            user,
        });
})

export const getUser = asyncHandler(async (req, res) => {
    //getting uid from req.user
    const { uid } = req.user
    //finding user in database
    const user = await User.findOne({ firebaseId: uid });
    //throw error in the case of not getting user
    if (!user) {
        throw new ApiError(404, "user not found!!")
    }
    return res
        .status(200)
        .json({
            success: true,
            user
        })
})

export const logoutUser = asyncHandler(async (req, res) => {
    //getting uid from req.user
    const { uid } = req.user
    //finding user from database
    const user = await User.findOne({ firebaseId: uid });
    //sending data
    return res
        .status(200)
        .json({
            message: "Logout successful",
            user
        });
});

export const loginUser = asyncHandler(async (req, res) => {
    const auth = req.headers.authorization;
    //taking token from headers
    const idToken = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    if (!idToken) throw new ApiError(401, "Missing Authorization token");
    //decoding token using firebase admin.auth()
    const decoded = await admin.auth().verifyIdToken(idToken);
    console.log(decoded)
    const { uid } = decoded;
    //finding user from database
    const user = await User.findOne({ firebaseId: uid });
    return res
        .status(200)
        .json({
            message: "Logged in successful",
            user
        });
})

export const updateProfile = asyncHandler(async (req, res) => {
    const { fullname, about } = req.body;
    const { uid } = req.user;
    let {intrest} = req.body
    intrest = JSON.parse(intrest);

    let avatarUrl;
    if (req.file?.path) {
        const avatar = await uploadOnCloudinary(req.file.path);
        if (!avatar.url) {
            throw new ApiError(400, "Error during upload avatar on Cloudinary");
        }
        avatarUrl = avatar.url;
    }

    const updateData = { fullname, about, intrest };
    if (avatarUrl) updateData.avatar = avatarUrl;

    const user = await User.findOneAndUpdate(
        { firebaseId: uid },
        { $set: updateData },
        { new: true }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Profile updated successfully")
    );
});