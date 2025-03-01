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
      { text: 'Docs', link: '/docs' },
      { text: 'Demo', link: '/demo' },
    ],

    sidebar: [
      {
        text: 'Demo',
        items: [
          // { text: 'Markdown Examples', link: '/markdown-examples' },
          // { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'Custom input', link: '/custom-input' },
          { text: 'Dropdown', link: '/dropdown' },
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
