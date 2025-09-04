const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctor");
const Hospital = require("../models/hospital");

router.post("/", async (req, res) => {
    try {
        const { name, specialization, phone, availability, hospitalId } = req.body;
        
        if (!name || !specialization || !phone || !availability || !hospitalId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // if hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        const newDoctor = new Doctor({ name, specialization, phone, availability, hospitalId });
        await newDoctor.save();
        res.status(201).json(newDoctor);
    } catch (error) {
        console.error("Error creating doctor:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const specialization = req.query.specialization;
        // Use a case-insensitive RegExp for filtering
        const filter = specialization ? { specialization: new RegExp(specialization, "i") } : {};
        const doctors = await Doctor.find(filter).populate("hospitalId", "name");
        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate("hospitalId", "name");
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.json(doctor);
    } catch (error) {
        console.error("Error fetching doctor:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.json({ message: "Doctor deleted successfully" });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
