function deobfuscateCode() {
    const premiumKey = prompt('Please enter your premium key to proceed:');
    const validPremiumKey = '1022011'; // Replace with your actual premium key

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
