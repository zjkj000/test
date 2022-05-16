import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../../utils/Screen/GetSize";

export const styles = StyleSheet.create({
    default: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
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
    smallImg: {
        width: 30,
        height: 30,
    },
    bigImg: {
        width: 128,
        height: 128,
    },
    flgImg: {
        width: 20,
        height: 25,
    },
    askImg: {
        width: 16,
        height: 25,
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
        backgroundColor: "#fff",
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
        justifyContent: "space-evenly",
        alignItems: "center",
        borderBottomColor: "gray",
        borderBottomWidth: 1,
    },
    header_button: {
        height: "100%",
    },
    header_left: {
        flexDirection: "row",
        left: 0,
        top: 0,
        flex: 1,
        height: "100%",
        textAlign: "center",
        justifyContent: "space-evenly",
        textAlignVertical: "center",
    },
    header_right: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        top: 0,
        right: 0,
        flex: 1,
        height: "100%",
        textAlign: "center",
    },
    header_middle: {
        flex: 2,
        height: "100%",
        textAlign: "center",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    body: {
        width: screenHeight,
        flex: 10,
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    body_side: {
        padding: 10,
        height: "100%",
        flex: 1,
        borderColor: "gray",
        borderWidth: 1,
    },
    answer_title: {
        color: "#225481",
        fontSize: 20,
    },
    body_webview: {
        flexDirection: "column",
        flex: 2,
        height: "100%",
    },
    body_webview_row: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-evenly",
    },
    body_webview_col: {
        flex: 1,
        justifyContent: "space-evenly",
    },
    body_answerBox: {
        flex: 1,
        borderLeftColor: "black",
        borderLeftWidth: 1,
        height: "100%",
        marginLeft: 2,
    },
    bottom: {
        width: screenHeight,
        flex: 2,
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 5,
    },
    bottomLeft: {
        flex: 1,
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    bottomRight: {
        flex: 1,
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    QRCode: {
        width: screenWidth / 4,
        height: screenWidth / 4,
    },
    inputArea: {
        // width: "100%",
        flex: 2,
        height: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        // backgroundColor: "#E6DDD6",
        alignItems: "center",
    },
    PPT_area: { alignItems: "center", height: "100%", paddingTop: "35%" },
    little_image: { height: 50, width: 80, marginLeft: 5 },
    menu_image: {
        height: 20,
        width: 20,
    },
    checked: {
        height: 50,
        width: 80,
        marginLeft: 5,
        borderColor: "#FFA500",
        borderWidth: 2,
    },
    myCard: {
        width: (screenWidth * 100) / 100,
        height: (screenWidth * 60) / 100,
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        backgroundColor: "#fff",
        margin: 0,
        borderRadius: 5,
    },
    cardTitle: {
        fontSize: 18,
        color: "#3675A1",
        textAlign: "center",
    },
    cardBar: {
        flexDirection: "row",
        width: "100%",
        padding: 5,
        justifyContent: "space-evenly",
    },
    cardInput: {
        width: "100%",
    },
    cardHistoryList: {
        height: 70,
        width: "100%",
    },
    myBadge: {
        position: "absolute",
        top: -10,
        right: -6,
        zIndex: 2,
        color: "#DB4E30",
    },
});
