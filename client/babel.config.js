module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: '3',
        targets: {
          browsers: [
            'last 2 versions'
          ]
        },
        useBuiltIns: 'usage'
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ]
  ]
};
