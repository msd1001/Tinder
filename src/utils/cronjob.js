const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const SendEmail = require("./sendEmail.js");
const connectionRequestModel = require("../models/connectionRequest.js");

cron.schedule("0 8 * * *", async () => {
  console.log("Hello World, " + new Date());
  // send email to all people who got requests previous day
  try {
    const yesterday = subDays(new Date(), 0);
    // This will give 00:00 mid-night
    const yesterdayStart = startOfDay(yesterday);
    // This will give 11:59 P M
    const yesterdayEnd = endOfDay(yesterday);
    // Query to find out all the pending friend request send yesterday
    const pendingRequests = await connectionRequestModel
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId");
    // we will send email to the toUserId

    const listofEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];

    console.log(listofEmails);

    for (const email of listofEmails) {
      try {
        const res = await SendEmail.run(
          "New Friend Request pending for" + email,
        );
        console.log(res);
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
