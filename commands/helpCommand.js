// commands/helpCommand.js
module.exports = function(client, playerName) {
    client.game.Say(`${playerName}: Commands: .source, .help, .skin, .say, .team (number), .invite, .ping, .users, .kermit, (message)`);
};
