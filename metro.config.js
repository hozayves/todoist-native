const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname, {
  annotateReactComponents: true,
  enableSourceContextInDevelopment: false
});
config.resolver.sourceExts.push('sql');

module.exports = config;