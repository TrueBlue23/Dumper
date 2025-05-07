// Obfuscator Script
function obfuscateCode(inputCode) {
    const lines = inputCode.split("\n");
    let randomVariables = [];
    let obfuscatedCode = "";

    // Generate random variable names and encode each line
    lines.forEach((line) => {
        const randomVar = generateRandomVariable();
        randomVariables.push(randomVar);
        obfuscatedCode += `${randomVar} = "${btoa(line.trim())}";`; // Encode line with Base64
    });

    // Combine lines with confusing logic
    obfuscatedCode += "eval(";
    obfuscatedCode += randomVariables
        .map((varName) => `atob(${varName})`) // Decode and combine
        .join(" + ");
    obfuscatedCode += ");";

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
    const inputCode = document.getElementById("inputCode").value;
    const outputCode = obfuscateCode(inputCode);
    document.getElementById("outputCode").value = outputCode;
});
