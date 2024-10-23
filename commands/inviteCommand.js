// commands/inviteCommand.js
module.exports = function(client, messageContent, playerName) {
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
};
