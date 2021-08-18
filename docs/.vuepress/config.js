const path = require('path');
module.exports = {
  title: 'busyzz',
  description: 'minmin',
  themeConfig: {
    // 访问的public目录
    logo: '/images/avatar.jpg',
    nav: [
      { text: '概述', link: '/' },
      { text: 'Typescript', link: '/typescript/' },
      // { text: 'External', link: 'https://google.com' },
    ],
    sidebar: [
      ['/', '概述'],
      ['/typescript/', 'typescript'],
    ],
    // 未选中的列表是否需要展开
    displayAllHeaders: false,
    // 展开的层数 默认为1 展开到 ## -> ### 则不显示
    sidebarDepth: 2,
  },
  plugins: {
    '@vuepress/back-to-top': true,
    '@vssue/vuepress-plugin-vssue': {
      platform: 'github-v4',
      owner: 'busyzz-1994',
      repo: 'busyzz-1994.github.io',
      clientId: 'f35ba95e6a181bd537f8',
      clientSecret: '63d1205b2e72c908d59e2369df5d830b69e91b45',
      locale: 'zh',
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
