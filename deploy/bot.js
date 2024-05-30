const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const config = require('./config');

const bot = new TelegramBot(config.token, { polling: true });

const readBuildCount = () => {
  try {
    const data = fs.readFileSync('build_count.txt', 'utf8');
    return parseInt(data, 10) || 0;
  } catch (err) {
    return 0;
  }
};

const writeBuildCount = (count) => {
  fs.writeFileSync('build_count.txt', count.toString(), 'utf8');
};

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

  exec(command, (error, stdout, stderr) => {
    if (error) {
      bot.sendMessage(chatId, `\`\`\`${error.message}\`\`\``, params);
      return;
    }

    let buildCount = readBuildCount();
    buildCount += 1;

    bot.sendMessage(
      chatId,
      `\`\`\`

    ## Build

    -- ${buildCount} --

    ## Output

    ${stdout}

    ## Error

    ${stderr}

    \`\`\``,
      params
    );

    writeBuildCount(buildCount);
  });
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (!config.allowedUsers.includes(msg.from.id)) {
    bot.sendMessage(chatId, 'not allowed');
  }
});
