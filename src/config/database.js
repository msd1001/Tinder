// Whenever we want to connect our node application to mongodb database then we use moongose library

const mongoose = require("mongoose");

const connectDB = async () => {
  // this string we will get when we create cluster on mongodb database website, cluster could have many database each database have document
  console.log(process.env.DB_CONNECTION_SECRET);
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);

  // database name is Tinder.
  // inside Tinder we have collection called users
  // and response of users collection on mongocompass is called document which looks like JSON .
};

module.exports = connectDB;
