const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    phone: { type: String, required: true },
    availability: { type: String, required: true }, // e.g.,Mon-Fri aur 9 AM - 5 PM need to discuss like weekdays and weekends ya fir 24/7
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
});

module.exports = mongoose.model("Doctor", DoctorSchema);
