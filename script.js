document.getElementById("deobfuscatorForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const inputCode = document.getElementById("luaCodeInput").value;
    const outputElement = document.getElementById("output");

    if (!inputCode.trim()) {
        outputElement.value = "Error: No code provided.";
        return;
    }

    try {
        const deobfuscatedCode = deobfuscateLua(inputCode);
        outputElement.value = deobfuscatedCode || "Error: Unable to deobfuscate the code.";
    } catch (error) {
        outputElement.value = `Error during deobfuscation: ${error.message}`;
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
            // Example decoding logic: reverse digits (replace this logic with actual decoding as needed)
            const decoded = encodedNumber.split("").reverse().join("");
            return parseInt(decoded, 10);
        } catch {
            return encodedNumber; // Return as-is if decoding fails
        }
    });

    // Remove obfuscation patterns (example)
    code = code.replace(/obfuscation\["(.+?)"\]/g, (_, key) => key);

    // Beautify the code (improved formatting)
    code = code
        .replace(/;/g, ";\n")
        .replace(/\{/g, "{\n")
        .replace(/\}/g, "\n}")
        .replace(/\n\s*\n/g, "\n"); // Remove extra blank lines

    return code.trim();
}