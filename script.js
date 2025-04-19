document.addEventListener("DOMContentLoaded", function () {
    const inputElement = document.getElementById("inputScript");
    const outputElement = document.getElementById("outputScript");
    const deobfuscateButton = document.getElementById("deobfuscateBtn");

    // Function to decode Base64 strings
    const decodeBase64 = (encoded) => {
        try {
            return atob(encoded);
        } catch (e) {
            console.error("Base64 decoding failed:", e);
            return "[Invalid Base64]";
        }
    };

    // Function to decode hex-encoded strings
    const decodeHex = (hexString) =>
        hexString.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

    // Function to decode Unicode-encoded strings
    const decodeUnicode = (unicodeString) =>
        unicodeString.replace(/\\u([0-9A-Fa-f]{4})/g, (_, unicode) => String.fromCharCode(parseInt(unicode, 16)));

    // Function to simplify control flow
    const simplifyControlFlow = (script) => {
        // Remove dummy loops
        script = script.replace(/for\s*\(.*;.*;.*\)\s*{\s*}/g, "");
        // Remove empty conditionals
        script = script.replace(/if\s*\(.*\)\s*{\s*}/g, "");
        // Remove unnecessary "do...end" blocks (if applicable in JavaScript syntax)
        return script;
    };

    // Function to rename obfuscated variables
    const renameVariables = (script, variableMap) => {
        for (const [obfuscated, readable] of Object.entries(variableMap)) {
            const regex = new RegExp(`\\b${obfuscated}\\b`, "g"); // Match exact variable names
            script = script.replace(regex, readable);
        }
        return script;
    };

    // Beautify the script for readability
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
        if (!script.trim()) {
            alert("Please enter a script to deobfuscate.");
            return "";
        }

        console.log("Original Script:", script);

        // Step 1: Decode strings
        script = decodeHex(script);
        script = decodeUnicode(script);
        script = script.replace(/atob\(['"]([^'"]+)['"]\)/g, (_, base64) => decodeBase64(base64));

        // Step 2: Rename variables
        const variableMap = {
            "a1": "player",
            "b2": "health",
            "c3": "score",
        };
        script = renameVariables(script, variableMap);

        // Step 3: Simplify control flow
        script = simplifyControlFlow(script);

        // Step 4: Beautify the script
        script = beautifyScript(script);

        console.log("Deobfuscated Script:", script);
        return script;
    };

    // Attach the deobfuscation logic to the button
    deobfuscateButton.addEventListener("click", function () {
        const inputScript = inputElement.value;
        const outputScript = deobfuscate(inputScript);
        outputElement.value = outputScript;
    });
});
