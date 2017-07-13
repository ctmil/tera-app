cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "com.pylonproducts.wifiwizard.WifiWizard",
        "file": "plugins/com.pylonproducts.wifiwizard/www/WifiWizard.js",
        "pluginId": "com.pylonproducts.wifiwizard",
        "clobbers": [
            "window.WifiWizard"
        ]
    },
    {
        "id": "cordova-plugin-device-motion.Acceleration",
        "file": "plugins/cordova-plugin-device-motion/www/Acceleration.js",
        "pluginId": "cordova-plugin-device-motion",
        "clobbers": [
            "Acceleration"
        ]
    },
    {
        "id": "cordova-plugin-device-motion.accelerometer",
        "file": "plugins/cordova-plugin-device-motion/www/accelerometer.js",
        "pluginId": "cordova-plugin-device-motion",
        "clobbers": [
            "navigator.accelerometer"
        ]
    },
    {
        "id": "cordova-plugin-powermanagement.powermanagement",
        "file": "plugins/cordova-plugin-powermanagement/www/powermanagement.js",
        "pluginId": "cordova-plugin-powermanagement",
        "clobbers": [
            "window.powermanagement"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.pylonproducts.wifiwizard": "0.2.11",
    "cordova-plugin-device-motion": "1.2.5",
    "cordova-plugin-whitelist": "1.3.2",
    "cordova-plugin-powermanagement": "1.0.5"
};
// BOTTOM OF METADATA
});