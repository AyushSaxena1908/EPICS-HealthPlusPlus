const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    name: String,
    specialization: String,
    phone: String,
    availability: String,
});

const HospitalSchema = new mongoose.Schema({
    name: String,
    doctors: [DoctorSchema],
});

module.exports = mongoose.model("Hospital", HospitalSchema);
