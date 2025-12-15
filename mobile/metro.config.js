// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Set EXPO_ROUTER_APP_ROOT before getting config
process.env.EXPO_ROUTER_APP_ROOT = path.join(__dirname, 'app');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
