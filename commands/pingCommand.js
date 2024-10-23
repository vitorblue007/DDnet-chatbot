// commands/pingCommand.js
module.exports = function(client, playerName) {
    client.game.Ping().then((ping) => {
        client.game.Say(`Ping: ${ping}`);
    }).catch((err) => {
        client.game.Say(`${playerName}: Unable to retrieve ping.`);
        console.error("Ping error:", err);
    });
};
