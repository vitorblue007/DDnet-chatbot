let teeworlds = require('teeworlds'); // npm i teeworlds
let axios = require('axios'); // npm i axios
const webhookURL = require('./webhookURL'); // Import the webhook URL

// Server details
const ans = '172.233.24.214:8303';
const [ip, port] = ans.split(':');

// Create a Teeworlds client
let client = new teeworlds.Client(ip, Number.parseInt(port), "Utility_Bot", {
    identity: {
        name: 'Utility_Bot',
        clan: 'haxxer_team',
        color_body: '',
        color_feet: '',
        id: 0,
        country: 'BRA',
        skin: 'itsabot',
        use_custom_color: false,
    },
});

// Connect to the server
client.on("connected", () => {
    console.log("Bot connected to the server!");
    client.game.Say("Hello, there! I'm Utility_Bot! If you need help just type '.help'!");
});

// Handle player join events
client.on("player_joined", (player) => {
    client.game.Say(`${player.name} has joined the game!`);
});

// Handle incoming messages
client.on("message", (msg) => {
    if (!msg || !msg.author) return;

    const playerName = msg.author.ClientInfo?.name || "Hello Player";
    const messageContent = msg.message.toLowerCase();

    console.log("Received message:", messageContent);  // Log every message
    sendToWebhook(playerName, msg.message);

    // Respond only to messages that start with '.'
    if (messageContent.startsWith('.')) {
        console.log("Command detected:", messageContent); // Log detected commands
        handleCommands(client, playerName, msg.author.ClientInfo, messageContent);
    }
});

// Command handling function
function handleCommands(client, playerName, clientInfo, messageContent) {
    if (messageContent.startsWith(".help")) {
        require('./commands/helpCommand')(client, playerName);
    } else if (messageContent.startsWith(".skin")) {
        require('./commands/skinCommand')(client, playerName, clientInfo, messageContent.split(" ").slice(1));
    } else if (messageContent.startsWith(".say ")) {
        require('./commands/sayCommand')(client, messageContent);
    } else if (messageContent.startsWith(".team ")) {
        require('./commands/teamCommand')(client, playerName, messageContent);
    } else if (messageContent.startsWith(".source")) {
        require('./commands/sourceCommand')(client); // Correct usage here
    } else if (messageContent.startsWith(".kermit")) {
        require('./commands/kermitCommand')(client);
    } else if (messageContent.startsWith(".invite")) {
        require('./commands/inviteCommand')(client, messageContent, playerName);
    } else if (messageContent.startsWith(".ping")) {
        require('./commands/pingCommand')(client, playerName);
    } else if (messageContent.startsWith(".users")) {
        require('./commands/usersCommand')(client);
    } else {
        client.game.Say(`${playerName}: Unknown command. Type '.help' for a list of commands.`);
    }
}

// Connect the bot to the server
client.connect();

// Graceful shutdown
process.on("SIGINT", () => {
    client.Disconnect().then(() => {
        console.log("Disconnected. Exiting...");
        process.exit(0);
    }).catch(err => {
        console.error("Error while disconnecting:", err);
        process.exit(1);
    });
});

// Function to send a message to the webhook
function sendToWebhook(author, message) {
    axios.post(webhookURL, {
        username: author,
        content: "`" + message + "`",  // Send the actual message and adds a ` to prevent mentions
    })
    .then(response => {
        console.log('Message sent to webhook:', response.status);
    })
    .catch(error => {
        console.error('Error sending message to webhook:', error);
    });
}
