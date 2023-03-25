const {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");
const storage = require("../config/firebase");
const path = require("path");
const uuid = require("uuid").v4;

exports.uploadFile = async (folder, file) => {
  const name = uuid();
  const fileName = name + path.extname(file.originalname);
  const imageRef = ref(storage, `${folder}/${fileName}`);
  const uploadPath = (await uploadBytes(imageRef, file.buffer)).ref.fullPath;
  return uploadPath;
};

exports.getUrl = async (filePath) => {
  const storageRef = ref(storage, filePath);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};

exports.deleteFile = async (filePath) => {
  const storageRef = ref(storage, filePath);
  await deleteObject(storageRef);
};
