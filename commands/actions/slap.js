const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const actions = require('./../../assets/json/actions.json')
const fetch = require('node-fetch')
const baseURI = 'https://rra.ram.moe/i/r?type=slap'
const uri = 'https://rra.ram.moe'

module.exports.run = (bot,message,args) => {

  detectUserfromArgs(message).then(mentions => {

  	let embed = new RichEmbed().setColor(settings.colors.embedDefault)
    fetch(baseURI).then(res=>res.json()).then(json => {
          embed.setImage(uri+json.path)
      if (mentions.length<1){
        embed.setDescription(`${message.member}, please don't slap yourself!`).setImage(selfSlap())
        return message.channel.send(embed)
      } else if (mentions.includes(`**me**`)){
        embed.setDescription(`${message.member} slaps ${stringifyMentions(mentions)}!`)
        return message.channel.send(embed).then(()=>{
           message.channel.send(`(；︿ ；✿) I-I'm sorry.. You can slap them but please d-don't slap me...`)
        })
      } else {
        embed.setDescription(`${message.member} slaps ${stringifyMentions(mentions)}!`)
        return message.channel.send(embed)
      }
    })
  })
}

module.exports.help = {
  name: "slap",
  alias: [],
  group: 'action',
  description: 'Slaps the user/s you mentioned!',
  examples: ['slap @MaiSakurajima MaiSakurajima','slap MaiSakurajima','slap @MaiSakurajima'],
  parameters: ['mention', 'name']
}

function stringifyMentions(output){
	if (output.length === 2){
		output = output.join(' and ')
	} else if (output.length > 2 ){
		let last = output.pop()
		output = output.join(', ')+", and "+last
	}
	return (output)
}

function detectUserfromArgs(message){
return new Promise((resolve,reject)=>{
	let members = []
	let output = []

//detect the mentions
	if (message.mentions.members.size>0){
		message.mentions.members.forEach(member => {
			if (!members.includes(member)){
			members.push(member)
			}
		})
	}

	args = []
	arg1 = message.content.split(/ +/)
	arg2 = message.cleanContent.split(/ +/)
	arg1.forEach(content => {
		if (arg2.includes(content)){
			args.push(content)
		}
	})

	//detect the names
	args.forEach(word => {
		let found = message.guild.members.find(m=> (m.displayName.toLowerCase() === word.toLowerCase()) || (m.user.username.toLowerCase() === word.toLowerCase()))
		if (found){
			if (!members.includes(found)){
				members.push(found)
			}
		}
	})

	//extract the id
	members.forEach(member=>{
		if (member.id === message.member.id){
		 return
		} else if (member.id === message.client.user.id) {
			output.push('**me**')
		} else
		output.push(`<@${member.id}>`)
	})

	resolve(output)
})
}

function selfSlap() {
    var rand = ['https://i.imgur.com/JSe8hIy.gif', 'https://i.imgur.com/Cu9bGEA.gif'];
    return rand[Math.floor(Math.random() * rand.length - 1)];
}
