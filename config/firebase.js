const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
const firebaseConfig = {
  apiKey: "AIzaSyAhn2WylPKh7WMMiT5f3wr1WECSs94AUUA",
  authDomain: "sabi-dine.firebaseapp.com",
  projectId: "sabi-dine",
  storageBucket: "sabi-dine.appspot.com",
  messagingSenderId: "324835269789",
  appId: "1:324835269789:web:8a0c95088c3d5a66210874",
  measurementId: "G-KZ3FPBQ7QQ",
};

const app = initializeApp(firebaseConfig);

module.exports = getStorage(app);
