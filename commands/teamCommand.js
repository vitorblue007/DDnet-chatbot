// commands/teamCommand.js
module.exports = function(client, playerName, messageContent) {
    const teamNumber = messageContent.split(" ")[1];
    if (teamNumber) {
        client.game.Say(`/team ${teamNumber}`);
        client.game.Say(`/lock`); // Lock the team immediately after joining
        client.game.Say(`${playerName} has joined team ${teamNumber} and the team is now locked!`);
    } else {
        client.game.Say(`${playerName}: Please specify a team number.`);
    }
};
