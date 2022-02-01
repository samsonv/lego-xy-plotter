const readline = require('readline');
const PoweredUP = require("node-poweredup");
const poweredUP = new PoweredUP.PoweredUP();

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

poweredUP.on("discover", async (hub) => { // Wait to discover a Hub
    console.log(`Discovered ${hub.name}!`);
    await hub.connect(); // Connect to the Hub
    const yAxis = await hub.waitForDeviceAtPort("A");
    const xAxis = await hub.waitForDeviceAtPort("B");

    console.log("Connected! \nWaiting for keypress... \n(Press \"esc\" to exit)");

    process.stdin.on('keypress', (str, key) => {
        if (key.name === "escape") {
            process.exit();
        }

        (async () => await handleKeyPress(key.name, xAxis, yAxis))();
    })
});

poweredUP.scan(); // Start scanning for Hubs
console.log("Scanning for Hubs...");

const handleKeyPress = async (keypressed, xAxis, yAxis) => {
    switch (keypressed) {
        case "left":
            await xAxis.rotateByDegrees(30, 20);
            break;
        case "right":
            await xAxis.rotateByDegrees(30, -20);
            break;
        case "up":
            await yAxis.rotateByDegrees(30, 20);
            break;
        case "down":
            await yAxis.rotateByDegrees(30, -20);
            break;
        default:
            break;
    }
}
