const path = require('path');
module.exports = {
  title: 'busyzz',
  description: 'minmin',
  themeConfig: {
    logo: '/images/avatar.jpg',
    nav: [
      { text: '首页', link: '/' },
      { text: 'Typescript', link: '/typescript/' },
      // { text: 'External', link: 'https://google.com' },
    ],
    sidebar: [
      ['/', '首页'],
      ['/typescript/', 'typescript'],
    ],
    // 未选中的列表是否需要展开
    displayAllHeaders: false,
    // 展开的层数 默认为1 展开到 ## -> ### 则不显示
    sidebarDepth: 2,
  },
  plugins: {
    '@vuepress/back-to-top': true,
    '@vuepress/google-analytics': {
      ga: 'G-4Q01R6R1BJ',
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  },
};
