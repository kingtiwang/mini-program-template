const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const babel = require('@babel/core')
const less = require('less')
module.exports = {
  mode: 'development',
  watch: true,
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'dist')
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: '**/*.json',   to: './',   context: './src' },
        { from: '**/*.wxml',   to: './',   context: './src' },
        { from: '**/*.wxss',   to: './',   context: './src' },
        //{ from: '**/*.png',   to: './',   context: './src' },
        //{ from: '**/*.css',   to: './',   context: './src' },
        {
          from: '**/*.less',
          to({context, absoluteFilename}) {
            return `./${path.relative(context, absoluteFilename.replace('.less', '.wxss'))}`;//将less文件后缀名改为wxss
          },
          context: './src',
          transform(content, path) {
            return less.render(content.toString())
              .then(function (output) {
                return output.css;
              });
          },
        },
        {
          from: '**/*.js',
          globOptions: {//忽略测试文件
            ignore: ['**/*.test.js', '**/*.spec.js'],
          },          
          to: './',
          transform(content, path) {//使用babel实现ES6自动编译
            const newCode = babel.transformSync(content, {
              babelrc: true,
              "presets": ["@babel/env"]
            }).code;
            return Promise.resolve(newCode.toString());
          },
          context: './src'
        }
      ],
    }),
  ]
}