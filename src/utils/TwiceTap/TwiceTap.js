import { BackHandler, ToastAndroid } from "react-native";

let lastTime = 0;

let handler = null;

const bindBackExitApp = () => {
    handler = BackHandler.addEventListener("hardwareBackPress", () => {
        let time = Date.now();
        if (time - lastTime <= 2000) {
            BackHandler.exitApp();
            return false;
        } else {
            ToastAndroid.show("再按一次退出应用", ToastAndroid.SHORT);
            lastTime = time;
            return true;
        }
    });
};

const removeBackExitApp = () => {
    handler && handler.remove();
};

export { bindBackExitApp, removeBackExitApp };
