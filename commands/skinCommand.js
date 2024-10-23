// commands/skinCommand.js
module.exports = function(client, playerName, clientInfo, args) {
    if (args.length === 0) {
        const skin = clientInfo && clientInfo.skin ? clientInfo.skin : "default"; // Check if skin exists
        client.game.Say(`${playerName}: Your skin: ${skin}`);
    } else {
        const targetUser = client.SnapshotUnpacker.AllObjClientInfo.find(u => u.name === args[0] || u.id === parseInt(args[0]));
        if (targetUser) {
            const targetSkin = targetUser.skin ? targetUser.skin : "default"; // Check if the target user has a skin
            client.game.Say(`${playerName}: ${targetUser.name}'s skin is ${targetSkin}`);
        } else {
            client.game.Say(`${playerName}: User ${args[0]} not found.`);
        }
    }
};
