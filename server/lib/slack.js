const { WebClient } = require('@slack/web-api');

const slack = new WebClient(process.env.SLACK_TOKEN);

const notifyChannel = async (log, {
  attachments,
  channel = '#gamecenter-ops',
  text
}) => {
  if (process.env.GAME_ENV !== 'production') {
    return;
  }

  try {
    await slack.chat.postMessage({ attachments, channel, text });
  } catch (error) {
    log.error({ channel, error, source: 'slack.notifyChannel' }, 'Unable to send notification to Slack channel');
  }
};

module.exports = { notifyChannel };