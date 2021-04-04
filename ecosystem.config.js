module.exports = [{
  cwd: '/gamecenter/server',
  error_file: '/host/logs/gamecenter.error.log',
  ignore_watch: [ '**/node_modules/**' ],
  name: 'gamecenter',
  out_file: '/host/logs/gamecenter.console.log',
  script: 'main.js',
  watch: process.env.GAME_ENV === 'development' ? [ '/gamecenter/server', '/gamecenter/modules' ] : false,
  watch_options: {
    interval: 250,
    usePolling: true
  }
}];
