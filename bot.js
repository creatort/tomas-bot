const Discord = require("discord.js"); 



var eightball = [ 
    "yes!",
    "nope!",
    "maybe?",
    "probably",
    "I don't think so.",
    "never!",
    "you can try...",
    "up to you!",
]

var bot = new Discord.Client();

bot.on("ready", function() { 
    bot.user.setActivity("[xltra.xyz/tomas/] l - $") 
	bot.user.setStatus("dnd") 
	
    console.log("TomasBOT is ready!") 
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");
    var command = args[0].toLowerCase(); 
    var mutedrole = message.guild.roles.find("name", "tomasbot-muted");

    if (command == "help") {
        var embedhelpmember = new Discord.RichEmbed() 
            .setTitle("**List of Commands**\n")
            .addField(" - help", "Displays this message :grey_question:")
            .addField(" - info", "Gives you information about TomasBot (me) :grin:")
            .addField(" - ping", "Tests the bot's ping and response time :bell: (Correct usage: $ping)")
            .addField(" - cookie", "Send a cookie to anyone in the server :cookie: (Correct usage: $cookie @username)") 
            .addField(" - 8ball", "Gives you a randomized answer :8ball: (Correct usage: $8ball [question])")
			.addField(" - support", "Gives you a link to the support server. [Whitelist TomasBOT on your link bot if you have one]")
			.addField(" Prefix: ", "Prefix is set to '$' for all servers. Beta version's prefix is set to '£' in the support server.") 
            .setColor(0xFFA500)
            .setFooter("Oh hello!| TomasBot for Discord")
        var embedhelpadmin = new Discord.RichEmbed()
            .setTitle("**List of Admin Commands**\n")
            .addField(" - say", "Make the bot talk!  $say [message]")
            .addField(" - mute", "Mute a player with a reason (Correct usage: $mute @username [reason])") 
            .addField(" - unmute", "Unmute a player which has been muted (Correct usage: $unmute @username)")
            .addField(" - kick", "Kicks a member with the kick reason. (Correct usage: $kick @username [reason])") 
			.addField(" - purge", "Purge messages sent from TomasBot ($purge [amount])")
            .setColor(0xFF0000) 
            .setFooter("Ooo, an admin! | TomasBot for Discord")
        message.channel.send(embedhelpmember); 
        if(message.member.roles.some(r=>["tomasbot-admin"].includes(r.name)) ) return message.channel.send(embedhelpadmin);
    }

    if (command == "info") {
        message.channel.send("Hey! I am Tomas Bot! I am an artificial intellegence who likes discord. Nah! Just kidding, I am TomasBot and i can do quite a couple of things like kick, mute, 8ball, give cookie and some more! Thanks for using me and have a great day. :smile:") 
    }
	if (command == "support") {
        message.channel.send("Hi! If you need help feel free to join the support server to suggest and get help on issues or problems with the bot. https://discord.gg/mettf5p ") 
    }

    if (command == "ping") {
        message.channel.send("Pong!"); 
    }

    if (command == "cookie") {
        if (args[1]) message.channel.send(message.author.toString() + " has given you, " + args[1].toString() + " a cookie! :cookie:") 
        else message.channel.send("Who do you want to send a cookie to, ${message.author}? :cookie: (Correct usage: $cookie @username)") 
    }

    if (command == "8ball") { 
        if (args[1] != null) message.reply(eightball[Math.floor(Math.random() * eightball.length).toString(16)]);
        else message.channel.send("Oh! You didnt supply a question. Try again... [$8ball (question)]"); 
    }

    if (command == "say") { 
        if (!message.member.roles.some(r=>["tomasbot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!");
        var sayMessage = message.content.substring(4)
        message.delete().catch(O_o=>{});
        message.channel.send(sayMessage);
    }

    if(command === "purge") {
        let messagecount = parseInt(args[1]) || 1;

        var deletedMessages = -1;

        message.channel.fetchMessages({limit: Math.min(messagecount + 1, 100)}).then(messages => {
            messages.forEach(m => {
                if (m.author.id == bot.user.id) {
                    m.delete().catch(console.error);
                    deletedMessages++;
                }
            });
        }).then(() => {
                if (deletedMessages === -1) deletedMessages = 0;
                message.channel.send(":white_check_mark: Purged specified amount of messages.")
                    .then(m => m.delete(2000));
        }).catch(console.error);
    }

    if (command == "mute") {
        if (!message.member.roles.some(r=>["tomasbot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!");
        var mutedmember = message.mentions.members.first(); 
        if (!mutedmember) return message.reply("Please mention a valid member of this server!") 
        if (mutedmember.hasPermission("ADMINISTRATOR")) return message.reply("I cannot mute this member!")
        var mutereasondelete = 10 + mutedmember.user.id.length 
        var mutereason = message.content.substring(mutereasondelete).split(" ");
        var mutereason = mutereason.join(" "); 
        if (!mutereason) return message.reply("Please indicate a reason for the mute!") 
        mutedmember.addRole(mutedrole) 
            .catch(error => message.reply("Sorry, I couldn't mute because of an error, try the support server?")); 
        message.reply("Member Muted!"); 
    }

    if (command == "unmute") { 
        if (!message.member.roles.some(r=>["tomasbot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!");
        var unmutedmember = message.mentions.members.first(); 
        if (!unmutedmember) return message.reply("Please mention a valid member of this server!") 
        unmutedmember.removeRole(mutedrole) 
            .catch(error => message.reply("Sorry, I couldn't mute because of an error, check permissions or join the support server.")); 
        message.reply("Member Unmuted!"); 
    }

    if (command == "kick") { 
        if (!message.member.roles.some(r=>["tomasbot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!"); 
        var kickedmember = message.mentions.members.first(); 
        if (!kickedmember) return message.reply("Please mention a valid member of this server!") 
        if (!kickedmember.kickable) return message.reply("I cannot kick this member!") 
        var kickreasondelete = 10 + kickedmember.user.id.length 
        var kickreason = message.content.substring(kickreasondelete).split(" "); 
        var kickreason = kickreason.join(" "); 
        if (!kickreason) return message.reply("Please indicate a reason for the kick!")
        kickedmember.kick(kickreason)
            .catch(error => message.reply("Sorry, I couldn't kick because of an error, try the support sever?"));
        message.reply("Member has been kicked!"); 
    }

});

bot.login(BOT_TOKEN);
