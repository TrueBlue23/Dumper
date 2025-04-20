// Define the old unpack and appendfile functions
const oldUnpack = (...args) => args;
const oldAppendFile = (filename, content) => {
    const fs = require('fs');
    if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, content, { flag: 'a' });
    }
};

// Define the output file and credits
const output = 'yes.txt';

const Credits = `
          _____                   _______                   _____           _______                   _____                    _____                    _____          
         /\\    \\                 /::\\    \\                 /\\    \\         /::\\    \\                 /\\    \\                  /\\    \\                  /\\    \\         
        /::\\    \\               /::::\\    \\               /::\\____\\       /::::\\    \\               /::\\    \\                /::\\    \\                /::\\____\\        
       /::::\\    \\             /::::::\\    \\             /:::/    /      /::::::\\    \\             /::::\\    \\              /::::\\    \\              /:::/    /        
      /::::::\\    \\           /::::::::\\    \\           /:::/    /      /::::::::\\    \\           /::::::\\    \\            /::::::\\    \\            /:::/    /         
     /:::/\\:::\\    \\         /:::/~~\\:::\\    \\         /:::/    /      /:::/~~\\:::\\    \\         /:::/\\:::\\    \\          /:::/\\:::\\    \\          /:::/    /          
    /:::/__\\:::\\    \\       /:::/    \\:::\\    \\       /:::/    /      /:::/    \\:::\\    \\       /:::/  \\:::\\    \\        /:::/__\\:::\\    \\        /:::/____/           
    \\:::\\   \\:::\\    \\     /:::/    / \\:::\\    \\     /:::/    /      /:::/    / \\:::\\    \\     /:::/    \\:::\\    \\      /::::\\   \\:::\\    \\       |::|    |            
  ___\\:::\\   \\:::\\    \\   /:::/____/   \\:::\\____\\   /:::/    /      /:::/____/   \\:::\\____\\   /:::/    / \\:::\\    \\    /::::::\\   \\:::\\    \\      |::|    |     _____  
 /\\   \\:::\\   \\:::\\    \\ |:::|    |     |:::|    | /:::/    /      |:::|    |     |:::|    | /:::/    /   \\:::\\ ___\\  /:::/\\:::\\   \\:::\\    \\     |::|    |    /\\    \\ 
/::\\   \\:::\\   \\:::\\____\\|:::|____|     |:::|    |/:::/____/       |:::|____|     |:::|    |/:::/____/     \\:::|    |/:::/__\\:::\\   \\:::\\____\\    |::|    |   /::\\____\\
\\:::\\   \\:::\\   \\::/    / \\:::\\    \\   /:::/    / \\:::\\    \\        \\:::\\    \\   /:::/    / \\:::\\    \\     /:::|____|\\:::\\   \\:::\\   \\::/    /    |::|    |  /:::/    /
 \\:::\\   \\:::\\   \\/____/   \\:::\\    \\ /:::/    /   \\:::\\    \\        \\:::\\    \\ /:::/    /   \\:::\\    \\   /:::/    /  \\:::\\   \\:::\\   \\/____/     |::|    | /:::/    / 
  \\:::\\   \\:::\\    \\        \\:::\\    /:::/    /     \\:::\\    \\        \\:::\\    /:::/    /     \\:::\\    \\ /:::/    /    \\:::\\   \\:::\\    \\         |::|____|/:::/    /  
   \\:::\\   \\:::\\____\\        \\:::\\__/:::/    /       \\:::\\    \\        \\:::\\__/:::/    /       \\:::\\    /:::/    /      \\:::\\   \\:::\\____\\        |:::::::::::/    /   
    \\:::\\  /:::/    /         \\::::::::/    /         \\:::\\    \\        \\::::::::/    /         \\:::\\  /:::/    /        \\:::\\   \\::/    /        \\::::::::::/____/    
     \\:::\\/:::/    /           \\::::::/    /           \\:::\\    \\        \\::::::/    /           \\:::\\/:::/    /          \\:::\\   \\/____/          ~~~~~~~~~~          
      \\::::::/    /             \\::::/    /             \\:::\\    \\        \\::::/    /             \\::::::/    /            \\:::\\    \\                                  
       \\::::/    /               \\::/____/               \\:::\\____\\        \\::/____/               \\::::/    /              \\:::\\____\\                                 
        \\::/    /                 ~~                      \\::/    /         ~~                      \\::/____/                \\::/    /                                 
         \\/____/                                           \\/____/                                   ~~                       \\/____/                                  
                                                                                                                                           
                                                                     Moonsec V3 Dumper made by Solodev
`;

// Append content to a file
const appendFile = (filename, content) => {
    const fs = require('fs');
    if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, `${Credits}\n${content}`);
    }
    return oldAppendFile(filename, content);
};

// Format a table (array or object)
const format = (tab) => {
    let result = '{';
    for (const [index, value] of Object.entries(tab)) {
        if (typeof value === 'object' && value !== null) {
            result += format(value);
        } else {
            result += `\n'Index: ${index}' | 'Value: ${value}', `;
        }
    }
    result = result.slice(0, -2) + '\n},\n';
    return result;
};

// Iterate through a table
const foreach = (tab) => {
    if (typeof tab === 'object' && tab !== null) {
        for (const [index, value] of Object.entries(tab)) {
            if (typeof value === 'object' && value !== null) {
                appendFile(output, format(value) + '\n');
            } else {
                appendFile(output, `{Index: ${index} | Value: ${value}\n`);
            }
        }
    }
};

// Override the unpack function
const unpack = (...args) => {
    const result = oldUnpack(...args);
    if (typeof result === 'object' && result !== null) {
        foreach(result);
    }
    return result;
};

// Example usage
const exampleData = { a: 1, b: { c: 2, d: 3 } };
unpack(exampleData);
