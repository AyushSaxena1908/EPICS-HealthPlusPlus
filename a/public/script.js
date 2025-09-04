// Helper: Upload logic for both health and personal documents
async function uploadDocuments(inputSelector, docTypeSelector, listId, category) {
    const fileInputs = document.querySelectorAll(inputSelector);
    const docTypes = document.querySelectorAll(docTypeSelector);
    const docList = document.getElementById(listId);

    docList.innerHTML = '';

    for (let i = 0; i < fileInputs.length; i++) {
        const file = fileInputs[i].files[0];
        const docType = docTypes[i].value;

        if (!file) {
            alert("Please select a file to upload.");
            continue;
        }

        const listItem = document.createElement('li');
        listItem.textContent = `${docType}: ${file.name}`;
        docList.appendChild(listItem);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", docType);
        formData.append("category", category);

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                listItem.textContent += " ✅";
                console.log("Uploaded:", result.link);
            } else {
                listItem.textContent += " ❌";
                console.error("Upload failed:", result.message);
            }
        } catch (err) {
            listItem.textContent += " ❌";
            console.error("Upload failed:", err);
        }
    }
}

// Upload button handlers
document.getElementById('submitHealthDocuments').addEventListener('click', () => {
    uploadDocuments('.healthFileInput', '.healthDocType', 'healthDocumentList', 'health');
});

document.getElementById('submitPersonalDocuments').addEventListener('click', () => {
    uploadDocuments('.personalFileInput', '.personalDocType', 'personalDocumentList', 'personal');
});

// Add upload box for health docs
document.getElementById('addHealthUpload').addEventListener('click', () => {
    const container = document.getElementById('healthUploadContainer');
    const box = document.createElement('div');
    box.classList.add('upload-box');
    box.innerHTML = `
        <label>Choose a health document:</label>
        <input type="file" name="file" class="healthFileInput" accept=".pdf,.doc,.docx,.jpg,.png" required>
        <label>Select Document Type:</label>
        <select class="healthDocType">
            <option value="medical_report">Medical Report</option>
            <option value="prescription">Prescription</option>
            <option value="lab_result">Lab Result</option>
            <option value="insurance_document">Insurance Document</option>
            <option value="other">Other</option>
        </select>
    `;
    container.appendChild(box);
});

// Add upload box for personal docs
document.getElementById('addPersonalUpload').addEventListener('click', () => {
    const container = document.getElementById('personalUploadContainer');
    const box = document.createElement('div');
    box.classList.add('upload-box');
    box.innerHTML = `
        <label>Choose a personal document:</label>
        <input type="file" name="file" class="personalFileInput" accept=".pdf,.doc,.docx,.jpg,.png" required>
        <label>Select Document Type:</label>
        <select class="personalDocType">
            <option value="id">Identification (ID)</option>
            <option value="address_proof">Address Proof</option>
            <option value="other">Other</option>
        </select>
    `;
    container.appendChild(box);
});
