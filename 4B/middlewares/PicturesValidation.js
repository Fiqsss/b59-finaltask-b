const fs = require('fs');
const path = require('path');
const multer = require('multer');
const folderPath = path.resolve(__dirname, "../public/img/provinsi");

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationPath;
    if (
      req.originalUrl.includes("addprovinsi") ||
      req.originalUrl.includes("editprovinsi")
    ) {
      destinationPath = path.resolve(__dirname, "../public/img/provinsi");
    } else if (
      req.originalUrl.includes("addkabupaten") ||
      req.originalUrl.includes("editkabupaten")
    ) {
      destinationPath = path.resolve(__dirname, "../public/img/kabupaten");
    } else {
      return cb(new Error("Invalid upload route"), false);
    }

    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadImg = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
});

module.exports = { uploadImg };
