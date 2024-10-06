let teeworlds = require('teeworlds'); // npm i teeworlds
let axios = require('axios'); // npm i axios

const ans = '172.233.24.214:8308';
const webhookURL = "your webhook";

const [ip, port] = ans.split(':');
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

client.on("connected", () => {
    client.game.Say("Hello, there! I'm Utility_Bot! If you need help just type '.help'!");
});

// Handle player join events
client.on("player_joined", (player) => {
    client.game.Say(`${player.name} has joined the game!`);
});

client.on("message", (msg) => {
    if (!msg || !msg.author) return;

    const playerName = msg.author.ClientInfo?.name || "Hello Player";
    const messageContent = msg.message.toLowerCase();

    console.log(playerName, msg.message);
    sendToWebhook(playerName, msg.message);

    // Respond only to messages that start with '.'
    if (messageContent.startsWith('.')) {
        if (messageContent === ".help") {
            client.game.Say(`${playerName}: Commands: .source, .help, .myskin, .say, .team (number), .invite, .ping, .users, .map, .kermit`);
        } else if (messageContent === ".myskin") {
            client.game.Say(`${playerName}: Your skin: ${msg.author.ClientInfo?.skin}`);
        } else if (messageContent.startsWith(".say ")) {
            client.game.Say(msg.message.slice(5)); // Remove ".say "
        } else if (messageContent.startsWith(".team ")) {
            const teamNumber = messageContent.split(" ")[1];
            if (teamNumber) {
                client.game.Say(`/team ${teamNumber}`);
                client.game.Say(`/lock`); // Lock the team immediately after joining
                client.game.Say(`${playerName} has joined team ${teamNumber} and the team is now locked!`);
            } else {
                client.game.Say(`${playerName}: Please specify a team number.`);
            }
        } else if (messageContent === ".source") {
            console.log("Source command triggered");
            client.game.Say("This project source is located at 'https://github.com/vitorblue007/DDnet-chatbot'");
        } else if (messageContent === ".kermit") {
            client.game.Kill();
        } else if (messageContent.startsWith(".invite")) {
            const user = messageContent.split(" ")[1]; // Get the user from the command
            if (!user) {
                client.game.Say("Please provide a user name or user ID. Usage: .invite [username or user ID]");
                return;
            }

            const targetUser = client.SnapshotUnpacker.AllObjClientInfo.find(u => u.name === user || u.id === parseInt(user));
            if (!targetUser) {
                client.game.Say(`User ${user} not found.`);
                return;
            }

            client.game.Say(`Inviting ${targetUser.name} (ID: ${targetUser.id}) to the bot's team!`);
            client.game.Say(`/invite ${targetUser.name}`);
        } else if (messageContent === ".ping") {
            client.game.Ping().then((ping) => {
                client.game.Say(`Ping: ${ping}`);
            }).catch((err) => {
                client.game.Say(`${playerName}: Unable to retrieve ping.`);
                console.error("Ping error:", err);
            });
        } else if (messageContent === ".users") {
            let list = client.SnapshotUnpacker.AllObjClientInfo.map(a => a.name);
            client.game.Say("Users: " + list.join(", "));
        } else if (messageContent === ".map") {
            const currentMap = client.game.MapName; // Assuming `MapName` holds the current map name
            
            // Get the server location using an API
            axios.get(`http://ip-api.com/json/${ip}`)
                .then(response => {
                    if (response.data.status === "success") {
                        const location = `${response.data.city}, ${response.data.regionName}, ${response.data.country}`;
                        client.game.Say(`Server IP: ${ip}, Current Map: ${currentMap}, Location: ${location}`);
                    } else {
                        client.game.Say(`Server IP: ${ip}, Current Map: ${currentMap}, Location: Unable to retrieve location.`);
                    }
                })
                .catch(error => {
                    console.error("Error fetching location:", error);
                    client.game.Say(`Server IP: ${ip}, Current Map: ${currentMap}, Location: Error retrieving location.`);
                });
        } else {
            client.game.Say(`${playerName}: Unknown command. Type '.help' for a list of commands.`);
        }
    }
});

client.connect();

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
