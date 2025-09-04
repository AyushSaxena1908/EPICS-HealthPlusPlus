const express = require("express");
const router = express.Router();
const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post("/", async (req, res) => {
  // const { phoneNumber } = req.body;

  try {
    const call = await client.calls.create({
      url: "http://demo.twilio.com/docs/voice.xml",
      to: +917482009445,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    res.status(200).json({ message: "Call initiated", callSid: call.sid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to initiate call" });
  }
});

module.exports = router;
