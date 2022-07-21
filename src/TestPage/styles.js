import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../utils/Screen/GetSize";

export const styles = StyleSheet.create({
    mainContent: {
        width: screenWidth,
        height: screenHeight,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      }
});
