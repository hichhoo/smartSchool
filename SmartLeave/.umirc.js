// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  publicPath: './',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: false,
      dynamicImport: false,
      dll: false,
      fastClick: true,

      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
  theme: {
    'brand-primary': '#1296db'
  },
  history: 'hash',
  hash: true,
  targets: {safari: 9, ios: 9},
  ignoreMomentLocale: true,
  proxy: {
    '/api': {
      target: 'http://sc4.smartcollege.cn/',
      changeOrigin: true,
      pathRewrite: {"^/": ""}
    },
    '/tools': {
      target: 'http://sc4.smartcollege.cn/',
      changeOrigin: true,
      pathRewrite: {"^/": ""}
    },
    '/upload': {
      target: 'http://sc4.smartcollege.cn/',
      changeOrigin: true,
      pathRewrite: {"^/": ""}
    },
  },
}
