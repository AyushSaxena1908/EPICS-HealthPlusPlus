const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const apikeys = require('./apikey.json');

const app = express();
const PORT = 5000;

// Serve static files (HTML, CSS, JS, images)
app.use(express.static('public'));

// Multer setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
const upload = multer({ dest: uploadsDir });

// Google Drive API Setup
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const SHARED_FOLDER_ID = '1qfRU7GOAwSse8S8dzQ1YYJOo3bGKVoku'; // Change to your Drive folder ID

async function authorize() {
    const auth = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPES
    );
    await auth.authorize();
    return auth;
}

async function uploadToDrive(authClient, filePath, fileName, mimeType) {
    const drive = google.drive({ version: 'v3', auth: authClient });

    const fileMetadata = {
        name: fileName,
        parents: [SHARED_FOLDER_ID],
    };

    const media = {
        mimeType,
        body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id, webViewLink',
    });

    return response.data;
}

// Handle file upload POST
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const authClient = await authorize();

        console.log('Uploading:', file.originalname);

        const uploaded = await uploadToDrive(
            authClient,
            file.path,
            file.originalname,
            file.mimetype
        );

        // Delete file locally after upload
        fs.unlinkSync(file.path);

        res.status(200).json({
            success: true,
            fileId: uploaded.id,
            link: uploaded.webViewLink,
        });
    } catch (err) {
        console.error('Upload failed:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
