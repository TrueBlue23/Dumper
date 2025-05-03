function obfuscateText(code) {
    return code.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match) => {
        if (!obfuscationMap[match]) {
            obfuscationMap[match] = generateRandomString(8);
        }
        return obfuscationMap[match];
    });
}

function obfuscateCode() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
        alert('Please select a file to obfuscate.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const code = e.target.result;
        obfuscationMap = {}; // Reset the map
        let obfuscatedCode = '';
        if (file.name.endsWith('.lua')) {
            obfuscatedCode = obfuscateLua(code);
        } else if (file.name.endsWith('.js')) {
            obfuscatedCode = obfuscateJavaScript(code);
        } else if (file.name.endsWith('.html')) {
            obfuscatedCode = obfuscateHTML(code);
        } else if (file.name.endsWith('.txt')) {
            obfuscatedCode = obfuscateText(code); // New handling for .txt files
        } else {
            alert('Unsupported file type. Only Lua, JavaScript, HTML, and TXT are supported.');
            return;
        }
        document.getElementById('output').textContent = obfuscatedCode;
        downloadObfuscatedCode(obfuscatedCode, file.name);
    };
    reader.readAsText(file);
}
