// create router
// then import it in app.js file
// then create API
// check edge cases
// query to database
// create instance of schema
// save to database
const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");

const USER_SAFE_DATA = "firstName lastName photoUrl about skills ";

// we are trying to find ki loggedin user ko kitna request aaya hai
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      // toUserId mtlb jisee request send kiya hai uski id, hmyahi jana chahtey hai ki hmko kitne logoo nai request send kiya hai , jo log hmko request send kiya hogga vo toUserId mai mera id diyaa hi hogga, to find that hmlogapni id as touserId mai daal diye that will give us output that kitne request aaye huva hai
      // loggedInUser._id = fromuserId
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "skills",
    ]);
    // output jo aa rha tha usmai sirf ids aa rha tha isliye hmlog nai popualte use kiya , populate will only work when ref field is created in property fromUserId which is in connection schema

    res.json({ message: "Data fetched Successfully", data: connectionRequest });
  } catch (err) {
    res.status(400).send("ERR0R", err.message);
  }
});

// kitne loog ek particular user sai judee huve hai
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // Madhuresh sent request to Harsh, Harsh Accepted ( fromUserId is madhuresh)
    // preti sent request to Madhuresh, Madhuresh Accepted it ( toUserId is madhuresh )
    // in both cases Madhuresh connection increased, Madhuresh could be touserid & Madhursh could be fromuserid

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    // .populate("fromUserId", ["firstName", "lastName"]);

    const data = connectionRequest.map((row) => {
      // MAdhuresh could be fromUserId or toUserId;
      // if  Madhuresh logged in then jisko request sent kiya hai uskaa details dekhe if that user has accepted..
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });

    // I am trying to find connection request where my
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// userRouter.get("/feed?page=1&limit=10", userAuth, async (req, res) => {
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // User should see all the user card except
    // 0. his own card
    // 1. his connections
    // 2. ignored people
    // 3. already sent the connection request

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;

    // Find All Connections Request

    // We are trying to find all the request that  we have sent or which we have received
    // hm output mai sai sirf fromUserId and toUserId dekna chahatey hai, this will be achieved by select fn
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");
    // res.send(connectionRequests);
    // Donald is friend of APJ kalam
    // Donald has sent request to MAdhuresh
    // HArsh has sent request to Donald

    // These are the four people whom i need to hide from my feed, suppose Donald Trump login then Trump should not see his own profile in feed and to whom he is friend , or sent request , or receive the request  , in aove example therw will be total four people
    // Donald, Kalam , Madhuresh, Harsh

    const hideUsersFromFeed = new Set();
    // set is data structure which never contain duplicate value, we are adding all the request sent to donald trump or trump sent to other people,
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    // hideUsersFromFeed will contain all value which we do not need to show in the feed of Trump

    // Find All user from database who is not in the array  hideUsersFromFeed  and also user who is not the loggedin user.

    const users = await User.find({
      // find all the user's id which is not present in the array hideUsersFromFeed from database
      /*
      _id: { $nin: Array.from(hideUsersFromFeed) },
      // also we need to hide our own card
      // means id should not be equal to loggedin user id.
      _id: { $ne: loggedInUser._id },
      // we will combine both condition with and query
      */
      $and: [
        // $nin = notin
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        // $ne == notequal
        // $nin = notin
        //  // means id should not be equal to loggedin user id.
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    // simran interested in the Annaji,
    // Simran ignored Madhuresh
    // simran not see Harsh
    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
