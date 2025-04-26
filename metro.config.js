const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("db"); // Add any additional asset extensions
config.resolver.sourceExts.push("jsx", "js", "ts", "tsx", "json");

module.exports = config;
