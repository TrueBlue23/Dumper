// Lua Obfuscator Script
function obfuscateLuaCode(inputCode) {
    const lines = inputCode.split("\n");
    let randomVariables = [];
    let obfuscatedCode = "";

    // Generate random variable names and encode each line
    lines.forEach((line) => {
        const randomVar = generateRandomVariable();
        randomVariables.push(randomVar);

        // Add unnecessary logic to make the code confusing
        obfuscatedCode += `${randomVar} = "${btoa(line.trim())}"; `; // Encode line with Base64
        obfuscatedCode += `if ${randomVar} ~= nil then `; // Add confusion
        obfuscatedCode += `table.insert({}, ${randomVar} .. "dummy"); `; // Dummy operation
        obfuscatedCode += `end; `;
    });

    // Combine lines into a single eval structure
    obfuscatedCode += "loadstring(table.concat({";
    obfuscatedCode += randomVariables.map((varName) => `string.reverse(string.reverse(${varName}))`).join(", ");
    obfuscatedCode += "}))();";

    return obfuscatedCode;
}

function generateRandomVariable(length = 8) {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

document.getElementById("obfuscateButton").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const statusMessage = document.getElementById("statusMessage");

    if (!fileInput.files.length) {
        statusMessage.textContent = "Please upload a Lua (.lua) file to obfuscate.";
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const inputCode = event.target.result;
        const obfuscatedCode = obfuscateLuaCode(inputCode);

        // Create a blob and trigger download
        const blob = new Blob([obfuscatedCode], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "obfuscated.lua";
        link.click();

        statusMessage.textContent = "Obfuscation complete! File downloaded.";
    };

    reader.onerror = function () {
        statusMessage.textContent = "Error reading the file. Please try again.";
    };

    reader.readAsText(file);
});
