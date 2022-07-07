import { Dimensions,StatusBar} from "react-native";
const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export { screenWidth, screenHeight };
