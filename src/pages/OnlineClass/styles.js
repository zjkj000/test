import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../LatestTask/TodoList";

export const styles = StyleSheet.create({
    View: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    captionContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    captionIcon: {
        width: 10,
        height: 10,
        marginRight: 5,
    },
    captionText: {
        fontSize: 12,
        fontWeight: "400",
        fontFamily: "opensans-regular",
        color: "#8F9BB3",
    },
    Image: {
        alignItems: "center",
        margin: 20,
    },
    Input: {
        alignItems: "center",
        width: "80%",
        paddingTop: 15,
        backgroundColor: "#fff",
        fontStyle: {
            color: "#000",
        },
    },
    Button: {
        margin: 20,
        width: "70%",
    },
    Layout: {
        position: "absolute",
        bottom: 0,
    },
    ImageBottom: {
        position: "relative",
        flex: 1,
    },
    iconContainer: {
        padding: 100,
    },
    icon: {
        width: 128,
        height: 128,
    },
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    mainContainer: {
        width: screenHeight,
        height: screenWidth,
        justifyContent: "center",
        alignItems: "center",
    },
});
