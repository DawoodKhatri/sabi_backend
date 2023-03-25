const mongoose = require("mongoose");

connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(({ connection: { host } }) => {
      console.log(`Database Connected: ${host}`);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectDatabase;
