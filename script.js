document.addEventListener("DOMContentLoaded", function () {
    const inputElement = document.getElementById("inputScript");
    const outputElement = document.getElementById("outputScript");
    const deobfuscateButton = document.getElementById("deobfuscateBtn");

    // Create a loading animation
    const showLoading = () => {
        outputElement.value = "Deobfuscating";
        let dots = 0;
        const interval = setInterval(() => {
            dots = (dots + 1) % 4; // Cycle through 0, 1, 2, 3
            outputElement.value = "Deobfuscating" + ".".repeat(dots);
        }, 500);

        // Return a function to stop the loading animation
        return () => clearInterval(interval);
    };

    // Decode Base64 strings
    const decodeBase64 = (encoded) => {
        try {
            return atob(encoded);
        } catch (e) {
            console.warn("Base64 decoding failed:", e);
            return null; // Return null on failure
        }
    };

    // Decode hex-encoded strings
    const decodeHex = (hexString) =>
        hexString.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

    // Decode Unicode-encoded strings
    const decodeUnicode = (unicodeString) =>
        unicodeString.replace(/\\u([0-9A-Fa-f]{4})/g, (_, unicode) => String.fromCharCode(parseInt(unicode, 16)));

    // Simplify control flow
    const simplifyControlFlow = (script) => {
        // Remove unnecessary loops
        script = script.replace(/for\s*\w+\s*=\s*\d+,\s*\d+\s*do\s*end/g, "");
        // Remove empty conditionals
        script = script.replace(/if\s*\(.*?\)\s*then\s*end/g, "");
        return script;
    };

    // Rename obfuscated variables
    const renameVariables = (script, variableMap) => {
        for (const [obfuscated, readable] of Object.entries(variableMap)) {
            const regex = new RegExp(`\\b${obfuscated}\\b`, "g"); // Exact match for variable
            script = script.replace(regex, readable);
        }
        return script;
    };

    // Beautify the script
    const beautifyScript = (script) => {
        try {
            return js_beautify(script, { indent_size: 4 }); // Requires js-beautify library
        } catch (e) {
            console.warn("Beautification failed:", e);
            return script;
        }
    };

    // Main deobfuscation function
    const deobfuscate = (script) => {
        try {
            // Step 1: Decode strings
            script = decodeHex(script);
            script = decodeUnicode(script);
            script = script.replace(/atob\(['"]([^'"]+)['"]\)/g, (_, base64) => {
                const decoded = decodeBase64(base64);
                if (decoded === null) throw new Error("Base64 decoding failed");
                return decoded;
            });

            // Step 2: Simplify control flow
            script = simplifyControlFlow(script);

            // Step 3: Rename variables
            const variableMap = {
                "a1": "player",
                "b2": "health",
                "c3": "score",
            };
            script = renameVariables(script, variableMap);

            // Step 4: Beautify the script
            script = beautifyScript(script);

            return script;
        } catch (error) {
            console.error("Deobfuscation failed:", error);
            return null; // Return null if any error occurs
        }
    };

    // Attach the deobfuscation process to the button click
    deobfuscateButton.addEventListener("click", function () {
        const inputScript = inputElement.value;

        if (!inputScript.trim()) {
            alert("Please enter a script to deobfuscate.");
            return;
        }

        // Show loading animation
        const stopLoading = showLoading();

        setTimeout(() => {
            // Perform deobfuscation
            const outputScript = deobfuscate(inputScript);

            // Stop loading animation
            stopLoading();

            if (outputScript === null) {
                // Deobfuscation failed
                outputElement.value = "Failed dumping";
            } else {
                // Deobfuscation succeeded
                outputElement.value = outputScript;
            }
        }, 1000); // Simulate processing delay
    });
});
