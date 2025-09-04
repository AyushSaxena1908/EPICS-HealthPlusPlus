const express = require("express");
const router = express.Router();
const Hospital = require("../models/hospital");
const hospital = require("../models/hospital");

router.post("/", async (req, res) => {
  try {
    const { name, doctors } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Hospital name is required" });
    }
    const newHospital = new Hospital({ name, doctors });
    await newHospital.save();
    res.status(201).json(newHospital);
  } catch (error) {
    console.error("Error creating hospital:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    let query = {};
    if (req.query.name) {
      // Use a regex for case-insensitive matching
      query.name = new RegExp(req.query.name, "i");
    }
    const hospitals = await Hospital.find(query);
    res.json(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
