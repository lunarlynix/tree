const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    {
      name: 'status',
      description: "Fetch the tree's server status",
    },
    {
        name: 'lock',
        description: "Lock the power state of the tree"
    },
    {
        name: 'unlock',
        description: "Unlock the power state of the tree"
    },
    {
        name: 'api-info',
        description: "Fetch the tree's api info",
    },
    {
        name: 'info',
        description: "Information about LynxTree's Server"
    },
    {
        name: 'color',
        description: "Fetch the current tree color",
    },
    {
        name: 'flash',
        description: 'Flash .bin file from OTA URI',
        type: 1,
        options: [
          {
            name: 'url',
            description: 'URL of .bin file for firmware flashing',
            type: 3,
            required: true,
          },
        ],
    },
    {
        name: 'toggle-power',
        description: "Toggle the power, turn the tree on or off",
    },
    {
      name: 'setcolor',
      description: 'Set the color in Color Code or Color Name. this will change in real time!',
      type: 1,
      options: [
        {
          name: 'color',
          description: 'Color',
          type: 3,
          required: true,
        },
      ],
    },
    {
        name: 'animate',
        description: 'Anim unlimited amount of frames in Hex Code from an array',
        type: 1,
        options: [
          {
            name: 'array',
            description: 'array',
            type: 3,
            required: true,
          },
        ],
      },
    {
        name: 'power',
        description: 'Set Power',
        type: 1,
        options: [
          {
            name: 'mode',
            description: '1 = ON and 0 = OFF',
            type: 3,
            required: true,
          },
        ],
      },
      {
        name: 'brightness',
        description: 'Set Brightness',
        type: 1,
        options: [
          {
            name: 'intensity',
            description: 'Brightness from 0 to 100%',
            type: 3,
            required: true,
          },
        ],
      }
];
  
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(app_id), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();