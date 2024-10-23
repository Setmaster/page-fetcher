const url = process.argv[2];
const filePath = process.argv[3];
const fs = require('fs').promises;
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const needle = require('needle');

const writePage = async function () {
    try {
        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
        if (fileExists){
            const answer = await new Promise((resolve) => {
                rl.question(`The file ${filePath} already exists. Do you want to overwrite it? (y/n): `, resolve);
            });
            
            if (answer !== 'y'){
                console.log("Cancelling...");
                rl.close();
                process.exit(0);
            }
        }
        const response = await needle('get', url);

        if (response.statusCode !== 200) {
            console.error(`Status code error: ${response.statusCode}`);
        }

        await fs.writeFile(filePath, response.body, 'utf8');
        console.log(`File has been written successfully at ${filePath}`);
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(-1);
    }
}

writePage();