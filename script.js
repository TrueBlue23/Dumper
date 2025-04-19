document.getElementById("deobfuscateBtn").addEventListener("click", function () {
    const inputScript = document.getElementById("inputScript").value;

    if (!inputScript.trim()) {
        alert("Please paste a script to deobfuscate.");
        return;
    }

    try {
        // Example deobfuscation process (extend as needed)
        let deobfuscatedScript = inputScript;

        // Decode Base64 strings
        deobfuscatedScript = deobfuscatedScript.replace(/base64\.decode\(['"]([^'"]+)['"]\)/gi, function (_, encoded) {
            try {
                return atob(encoded); // Decode Base64
            } catch (e) {
                return "[Invalid Base64]";
            }
        });

        // Replace obfuscated variable names
        const variableMap = {
            "a1": "Player",
            "b2": "Health",
            "c3": "Score"
        };
        for (const [obfuscated, readable] of Object.entries(variableMap)) {
            const regex = new RegExp(`\\b${obfuscated}\\b`, "g");
            deobfuscatedScript = deobfuscatedScript.replace(regex, readable);
        }

        document.getElementById("outputScript").value = deobfuscatedScript;
    } catch (error) {
        document.getElementById("outputScript").value = "Error during deobfuscation: " + error.message;
    }
});
