const axios = require("axios");

const presetResponses = [
  { input: ["hi", "hello", "hey"], response: "Hello! How can I assist you today?" },
  { input: ["how are you", "how’s it going"], response: "I'm just a bot, but I'm here to help you!" },
  { input: ["i feel sick", "i am not well", "i have a fever", "i have a problem"], response: "I'm sorry to hear that. Can you describe your symptoms?" },
  { input: ["headache", "cough", "cold"], response: "It sounds like you might need medical attention. Would you like to consult a doctor?" },
  { input: ["chest pain", "breathing issues"], response: "This sounds serious. If it’s an emergency, please seek medical help immediately!" },
  { input: ["depression", "anxiety", "stress"], response: "Mental health is important. Would you like to talk to a counselor or therapist?" },
  { input: ["book appointment", "schedule doctor visit"], response: "I can help with that! When would you like to schedule an appointment?" },
  { input: ["medicine", "prescription"], response: "I recommend consulting a doctor before taking any medication. Would you like me to connect you with one?" },
  { input: ["thank you", "thanks"], response: "You're welcome! Stay safe and take care!" },
  { input: ["bye", "goodbye"], response: "Goodbye! If you need help again, just ask." },
  { input: ["stomach ache", "nausea", "vomiting"], response: "That sounds uncomfortable. Make sure to stay hydrated and rest. If symptoms persist, you should see a doctor." },
  { input: ["diarrhea", "loose motion"], response: "You might be dehydrated. Drink plenty of fluids and consider an oral rehydration solution." },
  { input: ["constipation"], response: "Try drinking more water and eating fiber-rich foods like fruits and vegetables." },
  { input: ["feeling dizzy", "lightheaded"], response: "Try sitting down and drinking some water. If this happens often, consult a doctor." },
  { input: ["fatigue", "tired all the time"], response: "Fatigue can be due to many factors, including diet, sleep, and stress. Have you been getting enough rest?" },
  { input: ["heartburn", "acid reflux"], response: "Try avoiding spicy foods and eating smaller meals. If it persists, consult a doctor." },
  { input: ["high blood pressure", "hypertension"], response: "Managing stress and maintaining a healthy diet can help. Would you like tips on low-sodium foods?" },
  { input: ["low blood pressure", "hypotension"], response: "Drinking more water and eating small, frequent meals may help. If symptoms persist, please see a doctor." },
  { input: ["diabetes", "high sugar levels"], response: "It's important to monitor your diet and blood sugar levels. Would you like diet recommendations?" },
  { input: ["low sugar levels", "hypoglycemia"], response: "Try eating a small snack with sugar, like fruit juice or candy, and monitor your levels." },
  { input: ["pregnancy", "pregnant"], response: "Congratulations! Let me know if you need guidance on prenatal care or a doctor consultation." },
  { input: ["exercise", "workout tips"], response: "Regular exercise is great for health! Are you looking for cardio or strength training tips?" },
  { input: ["healthy diet", "nutrition tips"], response: "Eating balanced meals with protein, fiber, and healthy fats can boost your energy and immunity." },
  { input: ["weight loss", "lose weight"], response: "A balanced diet and regular exercise help with weight management. Would you like meal planning tips?" },
  { input: ["weight gain", "gain muscle"], response: "Eating protein-rich foods and strength training can help build muscle. Need a diet plan?" },
  { input: ["covid", "coronavirus"], response: "If you have symptoms like fever, cough, or loss of taste, consider getting tested and isolating if needed." },
  { input: ["emergency", "help now"], response: "If this is a medical emergency, please call your local emergency number or go to the nearest hospital!" },
];


const userSessions = {};

const handleChatbotResponse = async (req, res) => {
  const { message, userId, phoneNumber } = req.body;

  if (!message || !userId || !phoneNumber) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!userSessions[userId]) {
    userSessions[userId] = { count: 0 };
  }

  userSessions[userId].count++;

  let botResponse = "I'm not sure how to respond to that. Can you clarify?";
  const lowerMessage = message.toLowerCase();

  for (const preset of presetResponses) {
    if (preset.input.some(input => lowerMessage.includes(input))) {
      botResponse = preset.response;
      break;
    }
  }

  if (userSessions[userId].count >= 4) {
    try {
      botResponse = "I am connecting you with a doctor now. Please wait for the call.";
      await axios.post("http://localhost:3000/call", { phoneNumber });
      userSessions[userId].count = 0;
    } catch (error) {
      console.error("Twilio Call Error:", error);
      botResponse = "I tried to connect you with a doctor, but something went wrong.";
    }
  }

  res.status(200).json({ response: botResponse });
};

module.exports = { handleChatbotResponse };
