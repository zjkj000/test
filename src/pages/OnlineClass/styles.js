import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../../utils/Screen/GetSize";

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
        width: "100%",
        height: "100%",
        flex: 4,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    alertFont: {
        fontSize: 40,
    },
    header: {
        width: screenHeight,
        flex: 1,
        padding: 10,
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "gray",
        borderBottomWidth: 1,
    },
    header_left: {
        left: 0,
        top: 0,
        flex: 1,
        height: "100%",
        textAlign: "center",
        justifyContent: "center",
    },
    header_right: {
        top: 0,
        right: 0,
        flex: 1,
        height: "100%",
        textAlign: "center",
        justifyContent: "center",
    },
    header_middle: {
        flex: 8,
        height: "100%",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    body: {
        width: screenHeight,
        flex: 5,
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    bottom: {
        width: screenHeight,
        flex: 1,
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        borderTopColor: "gray",
        borderTopWidth: 1,
    },
    QRCode: {
        width: screenWidth / 4,
        height: screenWidth / 4,
    },
    inputArea: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#E6DDD6",
        alignItems: "center",
    },
});
