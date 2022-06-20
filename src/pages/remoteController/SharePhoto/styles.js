import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../../../utils/Screen/GetSize";

export const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "column",
        width: screenWidth,
        height: screenHeight,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "blue",
    },
    header: {
        paddingHorizontal: 20,
        flexDirection: "row",
        width: screenWidth,
        flex: 1,
        borderColor: "gray",
        borderBottomWidth: 1,
        marginBottom: 5,
        // backgroundColor: "yellow",
        alignItems: "center",
        justifyContent: "space-between",
    },
    mainBody: {
        flex: 10,
        margin: 2,
        borderColor: "gray",
        borderWidth: 1,
        width: "98%",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
    },
    bodyCard: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        height: "100%",
    },
    buttonBar: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        padding: 5,
        margin: 2,
        width: screenWidth,
    },
    ImageBlock: {
        width: "100%",
        height: "100%",
    },
    shareImage: {
        width: "100%",
        height: "100%",
    },
});
