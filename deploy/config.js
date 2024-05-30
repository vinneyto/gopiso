require('dotenv').config();

module.exports = {
  token: process.env.TELEGRAM_BOT_TOKEN,
  allowedUsers: process.env.ALLOWED_USER_IDS.split(',').map((id) =>
    parseInt(id, 10)
  ),
  projectPath: process.env.PROJECT_PATH,
};
