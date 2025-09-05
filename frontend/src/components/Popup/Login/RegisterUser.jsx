import { FcGoogle } from "react-icons/fc";
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { signInWithGoogle, signUpWithEmailAndPassword } from '../../../redux-toolkit/Auth/authSlice.js';
import { CgSpinner } from "react-icons/cg";
import { clearError } from "../../../redux-toolkit/Auth/authSlice.js";

function RegisterUser({ isOpen, onClose, switchToLogin }) {
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [notMatch, setNotMatch] = useState();
    const dispatch = useDispatch();
    const { user, status, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentPassword !== password) {
            setNotMatch(true);
            return;
        }
        setNotMatch(false);
        dispatch(signUpWithEmailAndPassword({ email, password }));
    };
    const handleGoogleSignIn = () => {
        dispatch(signInWithGoogle());
    };
    //handle error
    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearError()); // reset the error in Redux
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (user) {
            onClose();
        }
    }, [user, onClose]);
    if (!isOpen) return null;

    return (
        <div className="fixed px-10 inset-0 z-50 flex items-center justify-center bg-neutral-950/60">
            <div className="w-full max-w-md bg-gray-100 dark:bg-neutral-800 rounded-lg shadow-xl p-10 relative">
                <h2 className="text-xl sm:mt-10 font-semibold text-center text-gray-800 dark:text-gray-300 mb-10">
                    Sign up to continue
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="text-sm w-full px-4 py-4 bg-gray-300 dark:bg-neutral-900 rounded-lg focus:outline-none"
                    />
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password"
                        className="text-sm w-full px-4 py-4 bg-gray-300 dark:bg-neutral-900 rounded-lg focus:outline-none"
                    />
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={notMatch ? "Password do not match" : "Confirm Password"}
                        className="text-sm w-full px-4 py-4 bg-gray-300 dark:bg-neutral-900 rounded-lg focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="cursor-pointer text-sm w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700
                        flex justify-center items-center gap-2"
                    >
                        {status == "loading" &&
                            <CgSpinner size={20} className="animate-spin" />
                        }
                        Sign up
                    </button>
                </form>

                <p className='w-full p-4 gap-2 flex justify-center items-center text-sm'>
                    Already have an account?
                    <button onClick={switchToLogin} className='cursor-pointer font-semibold text-red-500'>
                        Login
                    </button>
                </p>

                <div className="my-6 flex items-center">
                    <hr className="flex-grow border-gray-400" />
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <hr className="flex-grow border-gray-400" />
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 text-sm text-white py-4 sm:mb-10 rounded-lg cursor-pointer"
                >
                    <FcGoogle />
                    Continue with Google
                </button>
            </div>
        </div>
    )
}

export default RegisterUser