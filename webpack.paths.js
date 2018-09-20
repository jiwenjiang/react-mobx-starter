/**
 * Created by j_bleach on 2018/9/20 0020.
 */
const path = require('path')
const webpack = require('webpack')

module.exports = {

    resolve: {
        extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
        alias: {
            containers: path.resolve(paths.appSrc, 'containers'),
            component: path.resolve(paths.appSrc, 'component'),
            assets: path.resolve(paths.appSrc, 'assets'),
            config: path.resolve(paths.appSrc, 'config'),
            services: path.resolve(paths.appSrc, 'services'),
            // Support React Native Web
            // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
            'react-native': 'react-native-web',
        },
    },

}