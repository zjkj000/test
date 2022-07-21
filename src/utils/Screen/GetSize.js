import { Dimensions, PixelRatio } from "react-native";
const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

// 以Iphone6为基准
let baseWidth = 750;
let baseHeight = 1334;
let basePixelRatio = 2;
const w2 = baseWidth / basePixelRatio;
const h2 = baseHeight / basePixelRatio;
const scale = Math.min(screenHeight / h2, screenWidth / w2);

function GetSize(size) {
    size = Math.round(size * scale + 0.5);
    return size / basePixelRatio;
}

export { screenWidth, screenHeight, GetSize };
