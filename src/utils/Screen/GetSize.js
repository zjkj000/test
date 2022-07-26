import { Dimensions, PixelRatio , StatusBar } from "react-native";
const screenWidth = Math.round(Dimensions.get("window").width);
//顶部显示时间等信息的高度
const STATUS_BAR_HEIGHT = Math.round(StatusBar.currentHeight); 
const screenHeight = Math.round(Dimensions.get("window").height) - STATUS_BAR_HEIGHT;
const screenWidth2 = Math.round(Dimensions.get("screen").width);
const screenHeight2 = Math.round(Dimensions.get("screen").height);

// 以Iphone6为基准
let baseWidth = 800;
let baseHeight = 1280;
let basePixelRatio = 1.3;
const w2 = baseWidth / basePixelRatio;
const h2 = baseHeight / basePixelRatio;
const scale = Math.min(screenHeight / h2, screenWidth / w2);

function GetSize(size) {
    size = Math.round(size * scale + 0.5);
    return size / basePixelRatio;
}

export { screenWidth, screenHeight, screenHeight2, screenWidth2, GetSize };
