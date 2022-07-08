import { Dimensions, PixelRatio } from "react-native";
const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);
function isPad() {
    let x = Math.pow(screenWidth, 2);
    let y = Math.pow(screenHeight, 2);
    let screenInches = Math.sqrt(x + y);
    let pi = PixelRatio.get();
    console.log("isPad====================================");
    console.log(screenInches);
    console.log(Dimensions);
    console.log(pi);
    console.log("====================================");
    return screenInches >= 7.0;
}

export { screenWidth, screenHeight, isPad };
