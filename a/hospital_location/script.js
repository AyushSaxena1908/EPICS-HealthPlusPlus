// script.js

const hospitals = [
  "Apollo Hospital",
  "Fortis Healthcare",
  "Max Hospital",
  "AIIMS Delhi",
  "Medanta Hospital",
  "Narayana Health",
];

const doctors = [
  {
    name: "Dr. Meera Sharma",
    specialization: "Cardiologist",
    hospital: "Apollo Hospital",
    timing: "10am - 1pm",
    phone: "1234567890",
  },
  {
    name: "Dr. Raj Verma",
    specialization: "Neurologist",
    hospital: "Fortis Healthcare",
    timing: "2pm - 5pm",
    phone: "9876543210",
  },
  {
    name: "Dr. Sunita Rao",
    specialization: "Dermatologist",
    hospital: "Max Hospital",
    timing: "12pm - 3pm",
    phone: "1122334455",
  },
  {
    name: "Dr. Kiran Singh",
    specialization: "Orthopedic",
    hospital: "Medanta Hospital",
    timing: "9am - 12pm",
    phone: "9988776655",
  },
  {
    name: "Dr. Arvind Jain",
    specialization: "Pediatrician",
    hospital: "AIIMS Delhi",
    timing: "11am - 2pm",
    phone: "8899776655",
  },
  {
    name: "Dr. Neha Kapoor",
    specialization: "Psychiatrist",
    hospital: "Narayana Health",
    timing: "3pm - 6pm",
    phone: "7788996655",
  },
];

// Hospital search functionality
const hospitalInput = document.getElementById("hospitalSearch");
const hospitalResults = document.getElementById("hospitalResults");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", async () => {
  const query = hospitalInput.value.toLowerCase();
  hospitalResults.innerHTML = "";
  try {
    const res = await fetch(
      `http://localhost:3000/hospital?name=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    if (data.length === 0) {
      hospitalResults.innerHTML = "<li>No hospital found</li>";
    } else {
      data.forEach((h) => {
        const li = document.createElement("li");
        li.textContent = h.name;
        hospitalResults.appendChild(li);
      });
    }
  } catch (error) {
    hospitalResults.innerHTML = "<li>Error fetching hospitals</li>";
    console.error("Fetch error:", error);
  }
});

// Specialization filter
const specializationSelect = document.getElementById("specializationSelect");
const doctorResults = document.getElementById("doctorResults");

specializationSelect.addEventListener("change", async () => {
  const value = specializationSelect.value;
  doctorResults.innerHTML = "";
  if (value === "") return;
  try {
    const res = await fetch(
      `http://localhost:3000/doctors${
        value ? `?specialization=${encodeURIComponent(value)}` : ""
      }`
    );

    const doctorsFromAPI = await res.json();
    if (doctorsFromAPI.length === 0) {
      // doctorResults.innerHTML = "<li>No doctors found</li>";
      const fallbackDoctors = doctors.filter(
        (d) => d.specialization.toLowerCase() === value.toLowerCase()
      );
      if (fallbackDoctors.length === 0) {
        doctorResults.innerHTML = "<li>No doctors found</li>";
      } else {
        fallbackDoctors.forEach((d) => {
          const li = document.createElement("li");
          li.textContent = `${d.name} (${d.hospital}) - ${d.timing}`;
          li.addEventListener("click", () => fillDoctorForm(d));
          doctorResults.appendChild(li);
        });
      }
    } else {
      doctorsFromAPI.forEach((d) => {
        const li = document.createElement("li");
        // Using 'hospitalId.name' as it's populated from your backend
        li.textContent = `${d.name} (${
          d.hospitalId?.name || "No Hospital"
        }) - ${d.availability}`;
        li.addEventListener("click", () => fillDoctorForm(d));
        doctorResults.appendChild(li);
      });
    }
    console.log("Doctor API response status:", res.status);
    // const doctorsFromAPI = await res.json();
    console.log("Doctors fetched:", doctorsFromAPI);
  } catch (error) {
    doctorResults.innerHTML = "<li>Error fetching doctors</li>";
    console.error("Fetch error:", error);
  }
});

// Fill form with selected doctor info
function fillDoctorForm(doctor) {
  document.getElementById("docName").value = doctor.name;
  document.getElementById("docSpecialization").value = doctor.specialization;
  document.getElementById("docTiming").value = doctor.availability; // Changed from timing
  document.getElementById("docHospital").value = doctor.hospitalId?.name || ""; // Changed from hospital
  document.getElementById("docPhone").value = doctor.phone;
}

// Form submission
const doctorForm = document.getElementById("doctorInfoForm");
doctorForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Doctor information submitted successfully!");
});
function openMap() {
  const location = document.getElementById("locationInput").value.trim();
  if (location) {
    const query = encodeURIComponent(location);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  } else {
    alert("Please enter a location.");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("doctorInfoForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent actual submission
    
    // Optional: Display alert or handle form data here
    alert("Doctor info submitted successfully!");

    // Reset form inputs
    form.reset();

    // Optional: Clear hospital and doctor result lists if needed
    document.getElementById("hospitalResults").innerHTML = "";
    document.getElementById("doctorResults").innerHTML = "";

    // Optional: Clear location and specialization selections
    document.getElementById("locationInput").value = "";
    document.getElementById("specializationSelect").selectedIndex = 0;
  });
});

