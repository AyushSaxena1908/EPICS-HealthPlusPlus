const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");

const ConnectDB = require("./db");


const hospitalRoutes = require('./routes/hospital')
const doctorsRoutes = require('./routes/doctor')
const chatbotRoutes = require("./routes/chatbot");
const callRoutes = require("./routes/call");

const app = express();
app.use(cors());
app.use(bodyParser.json());

ConnectDB();

app.use('/hospital',hospitalRoutes);
app.use('/doctors',doctorsRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/call", callRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });


