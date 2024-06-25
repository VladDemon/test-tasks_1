const { spawn } = require('child_process');
const path = require("path");


const services = [
    {name : 'service_users', script : path.join(__dirname, 'service_users', 'service1.js')},
    {name : 'service_users-history', script : path.join(__dirname, "dist", 'service2.js')},
]

function runService() {
    services.forEach( service => {
        const process = spawn('node', [service.script])

        process.stdout.on('data', (data) => {
            console.log(`${service.name}: ${data}`);
        });
    
        process.stderr.on('data', (data) => {
            console.error(`${service.name} error: ${data}`);
        });
    
        process.on('close', (code) => {
            console.log(`${service.name} process exited with code ${code}`);
        });
    })

    
}

function main () {
    runService();
}

main();