const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const config = require('./config');

const bot = new TelegramBot(config.token, { polling: true });

const commands = [
  {
    command: 'deploy_frontend',
    description: 'Deploy the frontend of the project.',
  },
];

bot
  .setMyCommands(commands)
  .then(() => {
    console.log('Commands are set.');
  })
  .catch((err) => {
    console.error('Commands set error: ', err);
  });

bot.onText(/\/deploy_frontend/, (msg) => {
  const chatId = msg.chat.id;

  if (!config.allowedUsers.includes(msg.from.id)) {
    bot.sendMessage(chatId, 'not allowed');
    return;
  }

  const dir = path.join(config.projectPath, 'frontend');
  const command = `cd ${dir} && git pull && pnpm install && pnpm run build`;
  const params = { parse_mode: 'Markdown' };

  bot.sendMessage(chatId, `\`\`\`${command}\`\`\``, params);

  exec(`cd ${dir} && git pull && pnpm run build`, (error, stdout, stderr) => {
    if (error) {
      bot.sendMessage(chatId, `\`\`\`${error.message}\`\`\``, params);
      return;
    }
    bot.sendMessage(chatId, `\`\`\`${stdout}\`\`\``, params);
    bot.sendMessage(chatId, `\`\`\`${stderr}\`\`\``, params);
  });
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (!config.allowedUsers.includes(msg.from.id)) {
    bot.sendMessage(chatId, 'not allowed');
  }
});
