const mongoose = require("mongoose");
// 1 . Create schema
// 2 create API
// 3 create instance of the schema
// 4 Save data to database

const connectionRequestSchema = new mongoose.Schema(
  {
    // Request sender id and Request Receiver ID
    // fromUserId (Sender)
    fromUserId: {
      // type is exact same as _id in mongoose
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // toUserId (Receiver)
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      // if we provide any other value beyond below four value then error will appear this is what  enum provide to us
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);

// HEre we are putting index on fromUserId and toUserId property together therefore  it is compound index anything like below query will work fast

// connectionRequest.find({
//   fromUserId: "69a6c3e98e52c4496341f054",
//   toUserId: "69a475d85ccfa701e919f72f",
// }); 1 represent ascending order -1 represent descending order

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Below check will run and ensure that we cannot send friend request to ourself

// schema.pre() will always run before saving the data to db meaning before calling save method
// connectionRequestSchema.pre("save", function (next) {
connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection Request to yourself!");
  }
  // It is like middleware , so we need to call next()
  // next();
});

// name of model and schema name

// creating the model
const connectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema,
);

module.exports = connectionRequestModel;
