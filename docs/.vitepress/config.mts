import { DefaultTheme, UserConfig } from 'vitepress';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';
import { withMermaid } from 'vitepress-plugin-mermaid';

const userConfig: UserConfig<DefaultTheme.Config> = {
  title: 'K5cJS',
  description: 'A VitePress Site',
  base: '/k5cjs/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/store/' },
    ],

    sidebar: [
      // {
      //   text: 'Libraries',
      //   items: [
      //     // { text: 'Markdown Examples', link: '/markdown-examples' },
      //     // { text: 'Runtime API Examples', link: '/api-examples' },
      //     { text: 'Custom input', link: '/custom-input' },
      //     { text: 'Dropdown', link: '/dropdown' },
      //   ],
      // },
      {
        text: 'Store',
        items: [
          { text: 'Overview', link: '/store/' },
          { text: 'Actions', link: '/store/actions' },
          { text: 'Reducer', link: '/store/reducer' },
          { text: 'Selectors', link: '/store/selectors' },
          { text: 'Http Service', link: '/store/http-service' },
          { text: 'Effects', link: '/store/effects' },
          { text: 'Service', link: '/store/service' },
          { text: 'Module', link: '/store/module' },
          { text: 'Usage', link: '/store/usage' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],

    search: {
      provider: 'local',
    },
  },
};

// https://vitepress.dev/reference/site-config
export default withMermaid({
  ...userConfig,

  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
    },
  },
  // your existing vitepress config...
  // optionally, you can pass MermaidConfig
  // mermaid: {
  //   // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  // },
});
