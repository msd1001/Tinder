// Whenever we want to connect our node application to mongodb database then we use moongose library

const mongoose = require("mongoose");

const connectDB = async () => {
  // this string we will get when we create cluster on mongodb database website, cluster could have many database each database have document
  await mongoose.connect(
    "mongodb+srv://madhureshsingh1001_db_user:iW8EsiXA37e7GGmm@clusternamasteharsh.0tsi7s9.mongodb.net/devTinder",
  );

  // database name is Tinder.
  // inside Tinder we have collection called users
  // and response of users collection on mongocompass is called document which looks like JSON .
};

module.exports = connectDB;
