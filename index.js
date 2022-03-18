/**
 * @format
 */

import "rn-overlay";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
// 显示网络请求
// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

AppRegistry.registerComponent(appName, () => App);
