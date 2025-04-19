document.getElementById("deobfuscatorForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const inputCode = document.getElementById("luaCodeInput").value;
    const outputElement = document.getElementById("output");

    if (!inputCode.trim()) {
        outputElement.textContent = "Error: No code provided.";
        return;
    }

    try {
        const deobfuscatedCode = deobfuscateLua(inputCode);
        outputElement.textContent = deobfuscatedCode || "Error: Unable to deobfuscate the code.";
    } catch (error) {
        outputElement.textContent = `Error during deobfuscation: ${error.message}`;
    }
});

function deobfuscateLua(code) {
    // Decode strings
    code = code.replace(/string\.decode\("(.+?)"\)/g, (_, encoded) => {
        try {
            const decoded = atob(encoded); // Base64 decode example
            return `"${decoded}"`;
        } catch {
            return `"${encoded}"`; // Return as-is if decoding fails
        }
    });

    // Decode numbers
    code = code.replace(/number\.decode\((\d+)\)/g, (_, encodedNumber) => {
        try {
            return parseInt(encodedNumber, 10); // Replace with actual decoding logic
        } catch {
            return encodedNumber; // Return as-is if decoding fails
        }
    });

    // Beautify the code (basic example)
    code = code.replace(/;/g, ";\n").replace(/\{/g, "{\n").replace(/\}/g, "\n}");

    return code;
}
