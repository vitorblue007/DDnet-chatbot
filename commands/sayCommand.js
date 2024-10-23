// commands/sayCommand.js
module.exports = function(client, messageContent) {
    client.game.Say(messageContent.slice(5)); // Remove ".say "
};
