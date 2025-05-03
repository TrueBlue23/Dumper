let obfuscationMap = {}; // Track original and obfuscated variable names

function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

function obfuscateJavaScript(code) {
    const premiumKey = prompt('Please enter your premium key to proceed:');
    const validPremiumKey = '201127'; // Replace with your actual premium key

    if (premiumKey !== validPremiumKey) {
        alert('Invalid premium key. Access denied.');
        return; // Exit the function if the key is invalid
    }

    const varRegex = /\b(var|let|const|function)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
    const stringRegex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;

    return code.replace(varRegex, (match, type, name) => {
        if (!obfuscationMap[name]) {
            obfuscationMap[name] = generateRandomString(8);
        }
        return `${type} ${obfuscationMap[name]}`;
    }).replace(stringRegex, () => `"${generateRandomString(16)}"`);
}

function deobfuscateCode() {
    const premiumKey = prompt('Please enter your premium key to proceed:');
    const validPremiumKey = 'YOUR_PREMIUM_KEY'; // Replace with your actual premium key

    if (premiumKey !== validPremiumKey) {
        alert('Invalid premium key. Access denied.');
        return; // Exit the function if the key is invalid
    }

    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
        alert('Please select a file to deobfuscate.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        let code = e.target.result;
        const reversedMap = Object.fromEntries(
            Object.entries(obfuscationMap).map(([key, value]) => [value, key])
        );
        for (const [obfuscated, original] of Object.entries(reversedMap)) {
            code = code.replace(new RegExp(`\\b${obfuscated}\\b`, 'g'), original);
        }
        document.getElementById('deobfuscatedOutput').textContent = code;
        downloadFile(code, `${file.name.split('.')[0]}_deobfuscated.txt`);
    };
    reader.readAsText(file);
}

function downloadFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
}
