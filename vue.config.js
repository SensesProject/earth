module.exports = {
  publicPath: './',
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass')
      }
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config
        .output
        .filename('[name].[hash].js')
        .end()
    }
  }
}
