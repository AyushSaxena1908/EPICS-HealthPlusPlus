const express = require("express");
const router = express.Router();
const { handleChatbotResponse } = require("../controllers/chatbotcontroller");

router.post("/", handleChatbotResponse);

module.exports = router;
