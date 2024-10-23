// commands/usersCommand.js
module.exports = function(client) {
    let list = client.SnapshotUnpacker.AllObjClientInfo.map(a => a.name);
    client.game.Say("Users: " + list.join(", "));
};
