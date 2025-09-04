const API_URL = "https://api.together.ai/v1/chat/completions";
const API_KEY = ""; // ⚠️ Replace with your key (for testing only, NOT in production)

let doctorsData = [];

// Load local doctor data JSON
fetch("doctor_names_apollo.json")
  .then((res) => res.json())
  .then((data) => {
    doctorsData = data.doctors;
    console.log("Loaded", doctorsData.length, "doctors.");
  })
  .catch((err) => console.error("Failed to load doctor data:", err));

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

async function sendMessage() {
    const userInputField = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userInput = userInputField.value.trim();

    if (!userInput) return;

    // Display user message
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.textContent = userInput;
    chatBox.appendChild(userMessage);
    userInputField.value = "";

    // Typing indicator
    const botTyping = document.createElement("div");
    botTyping.classList.add("message", "bot-message", "typing");
    botTyping.textContent = "Typing...";
    chatBox.appendChild(botTyping);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Check if user message relates to a doctor
    let lowerInput = userInput.toLowerCase();
    let match = doctorsData.find(doc =>
        doc.name.toLowerCase().includes(lowerInput) ||
        doc.occupation.toLowerCase().includes(lowerInput)
    );

    if (match) {
        chatBox.removeChild(botTyping);
        let botReply = `
            🧑‍⚕️ <strong>${match.name}</strong><br>
            🩺 ${match.occupation}<br>
            🕒 ${match.availability}<br>
            🧬 Experience: ${match.experience}
        `;
        const botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot-message");
        botMessage.innerHTML = botReply;
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }

    // Otherwise call Together AI
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
                messages: [{ role: "user", content: userInput }]
            })
        });

        if (!response.ok) throw new Error(`API Error ${response.status}: ${response.statusText}`);

        const data = await response.json();
        const botResponse = data.choices?.[0]?.message?.content || "Hmm, I didn't understand.";

        chatBox.removeChild(botTyping);
        const botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot-message");
        botMessage.textContent = botResponse;
        chatBox.appendChild(botMessage);
        
    } catch (error) {
        chatBox.removeChild(botTyping);
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("message", "bot-message");
        errorMessage.textContent = "⚠️ Error: Unable to fetch response.";
        chatBox.appendChild(errorMessage);
        console.error("Chatbot error:", error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

