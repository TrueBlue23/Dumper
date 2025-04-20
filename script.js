const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = 3000;

// Discord webhook URL
const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1363467805696987136/puUE-9zz3QzAteNP8Gvqk8xTw62ps3Djx30OUnBT1NWKKWVJA-Xq2PpSoa5fXCD-DnbB";

// Simple JavaScript obfuscation (renaming variables)
function obfuscateCode(code) {
    return code.replace(/\b(var|let|const)\s+(\w+)/g, (_, type, name) => {
        const obfuscatedName = "_" + Math.random().toString(36).slice(2, 8);
        return `${type} ${obfuscatedName}`;
    });
}

// Endpoint to handle obfuscation
app.post("/obfuscate", upload.single("codeFile"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = path.join(__dirname, req.file.path);
    const outputFilePath = path.join(__dirname, "uploads", `obfuscated_${req.file.originalname}`);

    // Read and obfuscate the code
    fs.readFile(filePath, "utf8", (err, code) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error reading file" });
        }

        const obfuscatedCode = obfuscateCode(code);

        // Save the obfuscated code to a new file
        fs.writeFile(outputFilePath, obfuscatedCode, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error saving obfuscated file" });
            }

            // Notify on Discord
            axios
                .post(DISCORD_WEBHOOK_URL, {
                    content: `A new code obfuscation just happened! File: ${req.file.originalname}`,
                })
                .catch((error) => console.error("Error sending Discord notification:", error));

            res.json({
                success: true,
                downloadUrl: `/downloads/obfuscated_${req.file.originalname}`,
            });
        });
    });
});

// Serve the uploads directory for downloading obfuscated files
app.use("/downloads", express.static(path.join(__dirname, "uploads")));

// Serve the frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`BluesHub Obfuscator running on http://localhost:${PORT}`);
});
