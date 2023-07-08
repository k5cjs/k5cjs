// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme';
import './style.css';

import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client';

export default {
  extends: Theme,
  // Layout: () => {
  //   return h(Theme.Layout, null, {
  //     // https://vitepress.dev/guide/extending-default-theme#layout-slots
  //   })
  // },
  // enhanceApp({ app, router, siteData }) {
  //   // ...
  // }
  enhanceApp({ app, router }) {
    enhanceAppWithTabs(app);

    console.log('router', router);

    router.go('/k5cjs/examples/');
  },
};
