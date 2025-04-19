function deobfuscate(code) {
    try {
        // Use eval to dynamically interpret the obfuscated code in a controlled environment
        // WARNING: Be cautious with eval and ensure you trust the input!
        let readableCode = eval(code);
        console.log("Readable Code:", readableCode);
    } catch (error) {
        console.error("Error deobfuscating:", error);
    }
}

let obfuscatedCode = '...'; // Replace this with your obfuscated code
deobfuscate(obfuscatedCode);
