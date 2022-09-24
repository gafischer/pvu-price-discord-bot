const fetch = require("node-fetch");
const Discord = require("discord.js");
require('dotenv/config');

const client = new Discord.Client({intents: new Discord.Intents(Discord.Intents.ALL)});


  client.on("ready", () => {  
      console.log("Ready!");

      var member;
      const guildId = client.guilds.cache.map((guild) => guild.id);
      const guild = client.guilds.cache.get(guildId.toString());
      guild.members.fetch(client.user.id).then((data) => (member = data));

      var change = "";
      var lastChange = 0;

      changeName();

      (function () {
        setInterval(changeName, 600000); //600000 = 10min
      })();

      async function changeName() 
      {
        try 
        {
          var response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=plant-vs-undead-token&vs_currencies=brl&include_24hr_change=true");   
          
          var json = await response.json();

          var currentPrice = json["plant-vs-undead-token"]["brl"]
          var currentChange = parseFloat(json["plant-vs-undead-token"]["brl_24h_change"]).toFixed(2);  

         // console.log("Price: " + currentPrice + " Change: " + currentChange + " Date: " + new Date().toLocaleString());     

          if (typeof member !== 'undefined') 
          {
            var i = 0
            while(i < 3)
            {
              try
              {
                member.setNickname("PVU: R$" + currentPrice.toString().replaceAll(".", ","));
                break;
              }  
              catch(ex)
              {
                i++;
                console.log(new Date().toLocaleString() + " - Erro NickName: " + ex) + " Tentativa: " + i;
              }            
            }           
          }

          if (currentChange < 0) 
          {
            change = "👇";
          } 
          else 
          {
            change = "☝️";
          }

          client.user.setActivity(
            change + " " + currentChange.toString().replaceAll(".", ",") + "%",
            {
              type: "PLAYING",
            }
          );
          lastChange = currentChange;   
        }
        catch(ex) 
        {
            console.log(new Date().toLocaleString() + " - Erro fetch: " + ex);
        }                   
      }
  });

  client.login(process.env.CLIENT_TOKEN);