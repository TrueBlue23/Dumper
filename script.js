// Strong JavaScript Deobfuscator
// Disclaimer: Use only on scripts you have permission to deobfuscate. For educational purposes only.

// Base64 Decoder
function decodeBase64(encoded) {
    try {
        return atob(encoded); // Decode Base64 string
    } catch (e) {
        return "[Invalid Base64]";
    }
}

// Hex Decoder
function decodeHex(encoded) {
    try {
        return encoded.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    } catch (e) {
        return "[Invalid Hex]";
    }
}

// Unicode Decoder
function decodeUnicode(encoded) {
    return encoded.replace(/\\u([0-9A-Fa-f]{4})/g, (_, unicode) => String.fromCharCode(parseInt(unicode, 16)));
}

// Rename Variables
function renameVariables(script, variableMap) {
    for (const [obfuscated, readable] of Object.entries(variableMap)) {
        const regex = new RegExp(`\\b${obfuscated}\\b`, "g"); // Match exact variable names
        script = script.replace(regex, readable);
    }
    return script;
}

// Simplify Control Flow
function simplifyControlFlow(script) {
    // Remove dummy loops
    script = script.replace(/for\s*\(.*;.*;.*\)\s*{\s*}/g, "");
    // Remove empty conditionals
    script = script.replace(/if\s*\(.*\)\s*{\s*}/g, "");
    return script;
}

// Beautification (Simple Indentation)
function beautifyScript(script) {
    try {
        return js_beautify(script, { indent_size: 4 }); // Using js-beautify library
    } catch (e) {
        console.warn("js-beautify not available; returning raw script.");
        return script;
    }
}

// Main Deobfuscation Function
function deobfuscate(script) {
    try {
        console.log("Starting deobfuscation...");

        // Step 1: Decode strings
        script = decodeHex(script);
        script = decodeUnicode(script);
        script = script.replace(/atob\(['"]([^'"]+)['"]\)/g, (_, base64) => decodeBase64(base64));

        // Step 2: Rename variables
        const variableMap = {
            "a1": "player",
            "b2": "health",
            "c3": "score"
        };
        script = renameVariables(script, variableMap);

        // Step 3: Simplify control flow
        script = simplifyControlFlow(script);

        // Step 4: Beautify
        script = beautifyScript(script);

        console.log("Deobfuscation complete.");
        return script;
    } catch (e) {
        console.error("Error during deobfuscation:", e);
        return "Error during deobfuscation.";
    }
}

// Example Usage
const obfuscatedScript = `
var a1 = atob("Z2FtZS5QbGF5ZXJzLkxvY2FsUGxheWVy"); // Base64 encoded string
var b2 = "\\x48\\x65\\x61\\x6c\\x74\\x68"; // Hex encoded string
var c3 = "\\u0053\\u0063\\u006f\\u0072\\u0065"; // Unicode encoded string
for (var i = 0; i < 10; i++) {} // Dummy loop
if (true) {} // Dummy condition
`;

console.log("Deobfuscated Script:\n", deobfuscate(obfuscatedScript));
