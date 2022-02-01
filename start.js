const readline = require('readline');
const PoweredUP = require("node-poweredup");
const poweredUP = new PoweredUP.PoweredUP();
const fs = require('fs');

const getInstructions = () => {
    const data = fs.readFileSync('draw-rectangle.gcode', 'UTF-8');
    const lines = data.split(/\r?\n/);

    const parseregex = /X(?<xmov>[\-\d]*\.\d*)\sY(?<ymov>[\-\d*]*\.\d*)/;
    return lines.filter(line => !!line.match(parseregex)).map(line => {
        const instructions = line.match(parseregex);
        return { x: instructions.groups.xmov, y: instructions.groups.ymov }
    });
}

// 1(1), 1(0), 2(1)

const draw = async (xAxis, yAxis, instructions) => {
    let pos = { x: 0.00, y: 0.00 }
    for (step of instructions) {
        const deltaX = parseFloat(step.x) - pos.x;
        const deltaY = parseFloat(step.y) - pos.y;
        console.log(`Moving x: ${step.x} (delta: ${deltaX}) y: ${step.y} (delta: ${deltaY})..`)
        await Promise.all([
            xAxis.rotateByDegrees(Math.abs(deltaX), deltaX > 0 ? -20 : 20),
            yAxis.rotateByDegrees(Math.abs(deltaY), deltaY > 0 ? -10 : 10)
        ]);
        pos = { x: parseFloat(step.x), y: parseFloat(step.y) }
    }
}

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
        case "p":
            const instructions = getInstructions();
            await draw(xAxis, yAxis, instructions);
        default:
            break;
    }
}
