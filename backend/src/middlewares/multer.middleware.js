import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); 
        //it can be problamatic due to multiple original 
        //names but due to short time insertion or deletion it is valid
    }
});

export const upload = multer({
    storage,
})