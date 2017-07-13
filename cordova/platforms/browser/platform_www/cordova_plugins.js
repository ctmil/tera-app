cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.pylonproducts.wifiwizard/www/WifiWizard.js",
        "id": "com.pylonproducts.wifiwizard.WifiWizard",
        "pluginId": "com.pylonproducts.wifiwizard",
        "clobbers": [
            "window.WifiWizard"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-motion/www/Acceleration.js",
        "id": "cordova-plugin-device-motion.Acceleration",
        "pluginId": "cordova-plugin-device-motion",
        "clobbers": [
            "Acceleration"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-motion/www/accelerometer.js",
        "id": "cordova-plugin-device-motion.accelerometer",
        "pluginId": "cordova-plugin-device-motion",
        "clobbers": [
            "navigator.accelerometer"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-motion/src/browser/AccelerometerProxy.js",
        "id": "cordova-plugin-device-motion.AccelerometerProxy",
        "pluginId": "cordova-plugin-device-motion",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-powermanagement/www/powermanagement.js",
        "id": "cordova-plugin-powermanagement.powermanagement",
        "pluginId": "cordova-plugin-powermanagement",
        "clobbers": [
            "window.powermanagement"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.2",
    "com.pylonproducts.wifiwizard": "0.2.11",
    "cordova-plugin-device-motion": "1.2.5",
    "cordova-plugin-powermanagement": "1.0.5"
}
// BOTTOM OF METADATA
});