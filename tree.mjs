var ip_address = "http://192.168.2.156/"

// Commands
var color_command = "Color%20"
var color_status_command = "Color"
var toggle_power_command = "Power%20TOGGLE"
var status_command = "STATUS"
var brightness_command = "Dimmer%20"
var power_command = "Power%20"

import { Client, GatewayIntentBits, AttachmentBuilder } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
import fetch from 'node-fetch';
import stc from 'string-to-color';
import fs from 'fs';
import request from 'request';

// Image Generation
import Canvas from '@napi-rs/canvas';
import { Console } from 'console'

// Memory-Store Animation 
var animation = false;
var animation_frames = [];
var animation_delay = 1500;

// Power Lock
var locked = true;


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'unlock') {
    try {
      if(interaction.user.id == "885224265014738975") {
        locked = false;
        await interaction.reply("``🔓 Unlocked power state!``");
      } else {
        await interaction.reply("``⚠️ You are not an authorized administrator of LynxTree API!``")
      }
    } catch (e) {
      console.log(e + " CATCHED!")
    }
  }
  if (interaction.commandName === 'flash') {
    await interaction.reply("``⚠️ [CORRUPTED] Failed to flash, corrupted firmware detected!``")
  }
  if (interaction.commandName === 'lock') {
    try {
      if(interaction.user.id == "885224265014738975") {
        locked = true;
        await interaction.reply("``🔒 Locked power state!``");
      } else {
        await interaction.reply("``⚠️ You are not an authorized administrator of LynxTree API!``")
      }
    } catch (e) {
      console.log(e + " CATCHED!")
    }
  }
  if (interaction.commandName === 'status') {
    try {
      const response = await fetch(ip_address + "cm?cmnd=" + status_command);
      const data = await response.json();
      await interaction.reply("**Lynix's Christmas tree's server status is :**" + '```json\n' + JSON.stringify(data, undefined, 4) + '```');
    } catch (e) {
      console.log(e + " CATCHED!")
    }
  }
  if (interaction.commandName === 'api-info') {
    try {
      const response = await fetch(ip_address + "cm?cmnd=" + status_command);
      const data = await response.json();
      await interaction.reply("**LynxTree API Info**" +
        "\nPowered by Linode" +
        "\nAPI Auth Key ID : 32dc2a08-3a38-4e52-a524-68bf3a9c0da4" +
        "\nBilling : 0.00$ CAD");
    } catch (e) {
      console.log(e + " CATCHED!")
    }
  }
  if (interaction.commandName === 'info') {
    try {
      const response = await fetch(ip_address + "cm?cmnd=" + status_command + "%2B" + "4");
      const data = await response.json();
      const response1 = await fetch(ip_address + "cm?cmnd=" + status_command + "%2B" + "1");
      const data1 = await response1.json();
      await interaction.reply(
        "**Lynix's Christmas Tree Server Info :**" +
        "\n\nCPU Speed : 80 MHz (1 Core)" +
        "\nRAM Speed : N/A" +
        "\nRAM: " + data.StatusMEM.Free + " bytes free out of " + data.StatusMEM.ProgramSize + " bytes" +
        "\nFlash Write Count: " + data1.StatusPRM.SaveCount + " at " + data1.StatusPRM.SaveAddress +
        "\nStorage : 2048 KB"
      );
    } catch (e) {
      console.log(e + " CATCHED!")
    }
  }
  if (interaction.commandName === 'brightness') {
    try {
      const response_power = await fetch(ip_address + "cm?cmnd=" + status_command);
      const data_power = await response_power.json();

      var power = data_power.Status.Power;

      if(power == "1") {
        var brightness = interaction.options.getString('intensity');
        const response = await fetch(ip_address + "cm?cmnd=" + brightness_command + brightness.replace("%", ""));
        const data = await response.json();
  
        await interaction.reply({
          content: "**Lynix's Christmas tree's brightness set to :** ``" + + brightness.replace("%", "") + "%``"
        });
      } else {
        await interaction.reply({
          content: "?"
        });
      }
    } catch (e) {
      console.log(e + " CATCHED!")
    }
  }
  if (interaction.commandName === 'power') {
    /*try {
      if(locked == false) {
      var power = interaction.options.getString('mode');
      const response = await fetch(ip_address + "cm?cmnd=" + power_command + power);
      const data = await response.json();

      if (power == "1") {
        let voltage = generateRandomFloatInRange(12, 12.2)

        await interaction.reply({
          content: "**:green_circle: Lynix's Christmas tree's power mode set to :** ``" + power +
            "``\n\nVoltage : ``" + (voltage).toFixed(3) + "v``" +
            "\nWattage : ``" + (voltage * 2.1).toFixed(3) + "w``"
        });
      } else {
        let voltage = generateRandomFloatInRange(5.5, 5.7)

        await interaction.reply({
          content: "**:red_circle: Lynix's Christmas tree's power mode set to :** ``" + power + "``" +
            "\n\nVoltage : ``" + (voltage).toFixed(3) + "v``" +
            "\nWattage : ``" + (voltage * 2).toFixed(3) + "w``"
        });
      }
    }
    else {
      await interaction.reply({
        content: "``❌ Permission Denied!``"
      });
    }
    } catch (e) {
      console.log(e + " CATCHED!")
    }*/
  }
  if (interaction.commandName === 'color') {
    try {
      const response = await fetch(ip_address + "cm?cmnd=" + color_status_command);
      const data = await response.json();

      const canvas = Canvas.createCanvas(50, 50);
      const context = canvas.getContext('2d');

      context.fillStyle = "#" + data.Color;
      context.fillRect(0, 0, 50, 50)

      const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'color.png' });

      await interaction.reply({
        files: [attachment],
        content: ":warning: You are being rate-limited. (api.lynix.ca)\n**Lynix's Christmas tree's is currently :** ``#" + data.Color + "``"
      });
    } catch (e) {
      console.log(e + " CATCHED!")
    }
  }
  if (interaction.commandName === 'animate') {
    try {
      const response_power = await fetch(ip_address + "cm?cmnd=" + status_command);
      const data_power = await response_power.json();

      var power = data_power.Status.Power;

      if(power == "1") {

      if(interaction.options.getString('array').split(",").length > 3 || interaction.options.getString('array').split(",").length < 2) {
        animation = false;

        await interaction.reply({
          content: ":x: Animation Failed to Play!\n\n"
          + "Frames : ``" + "❌ Invalid Frames" + "``\n"
          + "Animation Enabled : ``" + animation + "``"
        });
      } else {
        animation_frames = interaction.options.getString('array').split(",");
        animation = true;

        await interaction.reply({
          content: ":white_check_mark: Animation Played Succesfully!\n\n"
          + "Frames : ``" + animation_frames.toString() + "``\n"
          + "Animation Enabled : ``" + animation + "``"
        });
      }

    } else {
      await interaction.reply({
        content: "``❌ You cannot set animations while power is off!``"
      });
    }

    }
    catch (e) {
      console.log(e + " CATCHED!")
    }
  }
  if (interaction.commandName === 'setcolor') {
    /*try {
      const response_power = await fetch(ip_address + "cm?cmnd=" + status_command);
      const data_power = await response_power.json();

      var power = data_power.Status.Power;

      if(power == "1") {

      if (interaction.options.getString('color').includes("#")) {
        var color = interaction.options.getString('color');
        const response = await fetch(ip_address + "cm?cmnd=" + color_command + color.replace("#", ''));
        const data = await response.json();

        const canvas = Canvas.createCanvas(50, 50);
        const context = canvas.getContext('2d');

        context.fillStyle = color;
        context.fillRect(0, 0, 50, 50)

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'color.png' });

        await interaction.reply({
          files: [attachment],
          content: ":warning: You are being rate-limited. (api.lynix.ca)\n**Lynix's Christmas tree's is now the color :** ``#" + color.replace("#", '') + "``"
        });
      } else {
        var color = interaction.options.getString('color');

        var colors = JSON.parse(fs.readFileSync('D:/tree/colors.json', 'utf8'));

        var found_color = colors.find(element => color.toLowerCase() == element.name.toLowerCase())

        if (typeof found_color !== "undefined") {

          const response = await fetch(ip_address + "cm?cmnd=" + color_command + found_color?.hex?.replace("#", ''));
          const data = await response.json();

          const canvas = Canvas.createCanvas(50, 50);
          const context = canvas.getContext('2d');

          context.fillStyle = found_color?.hex;
          context.fillRect(0, 0, 50, 50)

          const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'color.png' });

          await interaction.reply({
            files: [attachment],
            content: ":warning: You are being rate-limited. (api.lynix.ca)\n**Lynix's Christmas tree's is now the color :** ``" + interaction.options.getString('color') + "``"
          });
        }
        else {
          // Keep previous color
          const response5 = await fetch(ip_address + "cm?cmnd=" + color_status_command);
          const data5 = await response5.json();

          var prev_color = data5.Color;

          await new Promise(resolve => setTimeout(resolve, 200));

          let delay = 500; // Delay in MS between frames
          let animation = ["ff0000", "000000", "ff0000", "ff0000", "000000", prev_color]; // Animation
          let restore_previous = true; // Restore Previous Color after animation is finished


          /*await animation.forEach(async (hex, index) => {
            const response = await fetch(ip_address + "cm?cmnd=" + color_command + hex);
            const data = await response.json();

            await sleep(1000);
          })

          for (var i = 0; i < animation.length; i++) {
            setTimeout(request, delay * i, ip_address + "cm?cmnd=" + color_command + animation[i], function (error, response, body) {
              console.log('error:', error);
              console.log('statusCode:', response && response.statusCode);
              console.log('body:', body);
            });
          }

          await interaction.reply({
            content: ":x: A invalid color was entered and was not set succesfully!\n**" + color + "** is not a valid color!"
          });
        }

      }
    } else {
      await interaction.reply({
        content: "``❌ You cannot set the color while power is off!``"
      });
    }
    } catch (e) {
      console.log(e + " CATCHED!")
    }*/
  }
  if (interaction.commandName === 'toggle-power') {
    try {

      if(locked == false) {
      
      const response = await fetch(ip_address + "cm?cmnd=" + toggle_power_command);
      const data = await response.json();

      const response_power = await fetch(ip_address + "cm?cmnd=" + status_command);
      const data_power = await response_power.json();

      var power = data_power.Status.Power;

      if (power == "1") {
        await interaction.reply("**Lynix's Christmas tree's is now :** ``on``");
      } else {
        await interaction.reply("**Lynix's Christmas tree's is now :** ``off``");
      }
      }
      else {
        await interaction.reply({
          content: "``❌ Permission Denied!``"
        });
      }
    } catch (e) {
      console.log(e + " CATCHED!")
    }
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateRandomFloatInRange(min, max) {
  return (Math.random() * (max - min + 1)) + min;
}

  (async function animate() {
      console.log("Animation Loop Fired! " + animation);

      if(animation == true) {
        for (var i = 0; i < animation_frames.length; i++) {
          await setTimeout(request, 1000 * i, ip_address + "cm?cmnd=" + color_command + animation_frames[i], function (error, response, body) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
          });
        }
      }
      setTimeout(animate, animation_delay)
  }());

client.login(token);
