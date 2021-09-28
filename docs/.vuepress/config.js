const path = require("path");
module.exports = {
  title: "busyzz",
  description: "minmin",
  themeConfig: {
    // 访问的public目录
    logo: "/images/avatar.jpg",
    nav: [
      { text: "指南", link: "/guide/" },
      { text: "Typescript", link: "/typescript/basic" }
    ],
    sidebar: [
      {
        title: "指南",
        collapsable: false,
        children: [["/guide/", "介绍"]]
      },
      {
        title: "Typescript",
        collapsable: false,
        children: [
          ["/typescript/basic", "Typescript基础"],
          ["/typescript/react", "React中使用TS"]
        ]
      },
      {
        title: "工程化",
        collapsable: false,
        children: [["/engineering/npm", "npm"]]
      },
      {
        title: "React",
        collapsable: false,
        children: [
          ["/react/hooks", "react-hooks"],
          ["/react/performance", "react优化"]
        ]
      }
    ],
    // 未选中的列表是否需要展开
    displayAllHeaders: false,
    // 展开的层数 默认为1 展开到 ## -> ### 则不显示
    sidebarDepth: 2
  },
  plugins: {
    "@vuepress/back-to-top": true,
    "@vssue/vuepress-plugin-vssue": {
      platform: "github-v4",
      owner: "busyzz-1994",
      repo: "busyzz-1994.github.io",
      clientId: "f35ba95e6a181bd537f8",
      clientSecret: "63d1205b2e72c908d59e2369df5d830b69e91b45",
      locale: "zh"
    },
    "@vuepress/medium-zoom": {
      selector: "img.zoom-custom-imgs",
      options: {
        margin: 16
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, ".")
      }
    }
  }
};
