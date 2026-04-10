const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");

const sendEmail = require("../utils/sendEmail.js");

//  toUseId mtlb jisee request beja gaya hai
//  : (colon) represent  dynamic value which we can receive from client or postman,
// :status , status could be interested or pass, value will come from api or :toUserId
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // jo logged in user hai usii ko bolntey hai fromuserID ( iss user sai request gaya)  fromUserId is coming from  userAuth
      const fromUserId = req.user._id;
      //toUserId we will get from params
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // API level handling
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type: " + status });
      }

      // We are checking that whether the user to whom we are sending request exist in database or not

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }

      // if connection request already exists
      //  like A has sent friend request to B then A cannot re-sent the request.
      // and B also cannot sent request to A
      const existingConnectionRequest = await ConnectionRequest.findOne({
        // checking two condition
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],

        //suppose there are 1000 user and each user sending 100 of request then there will be lakhs of connection request in db,therefore we need to provide index and we are providing index to two field together then it is called compound index, this will help us to query efficiently we will get result quickly
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Already Exist" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      // Email
      const emailRes = await sendEmail.run(
        "A New friend Request",
        req.user.firstName + " " + status + " " + toUser.firstName,
      );
      console.log(emailRes);
      res.json({
        message: req.user.firstName + " " + status + " " + toUser.firstName,
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      //status hamara accepted ya rejected hogga

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status is not allowed" });
      }

      // jisko friend request send kiya hai wahi accept kr sktta hai mtlb touserId jo hai vo abhi logged in  kiya huva hai,// loggedInid == toUserid

      // ab database mai search kr rhe hai to find  one connection  with particular requestId,touSerId and status should be interested
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      // we are updating status to accepted or rejected
      connectionRequest.status = status;

      const data = await connectionRequest.save();
      res.json({ message: "Connection request" + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

module.exports = requestRouter;
