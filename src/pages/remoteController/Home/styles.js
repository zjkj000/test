import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../../utils/Screen/GetSize";

export const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "column",
        width: screenWidth,
        height: screenHeight,
        // backgroundColor: "blue",
    },
    header: {
        paddingHorizontal: 20,
        flexDirection: "row",
        width: screenWidth,
        flex: 1,
        // backgroundColor: "yellow",
        borderColor: "gray",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerText: {
        color: "#4E9AC0",
        fontSize: 20,
    },
    smallImg: {
        width: 24,
        height: 24,
    },
    infoContainer: {
        flexDirection: "row",
        width: screenWidth,
        flex: 6,
        borderColor: "gray",
        borderBottomWidth: 1,
        // backgroundColor: "red",
    },
    buttonZone: {
        flex: 1,
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-around",
        // backgroundColor: "purple",
        borderColor: "gray",
        borderRightWidth: 1,
        alignItems: "center",
    },
    buttonImg: {
        width: 105,
        height: 50,
    },
    infoZone: {
        flex: 2,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 2,
    },
    infoZone_row: {
        flex: 3,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    infoZone_button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    infoZone_img: {
        width: 93,
        height: 74,
    },
    infoZone_text: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    controllerContainer: {
        flexDirection: "column",
        width: "100%",
        flex: 8,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
        marginTop: 50,
        // alignContent: "space-around",
        // padding: 5,
    },
    controllerRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%",
        flex: 1,
        // borderColor: "red",
        // borderWidth: 1,
        backgroundColor: "rgba(255,255,255,0)",
    },
    controllerBlock: {
        flex: 2,
        // borderColor: "blue",
        // borderWidth: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0)",
    },
    controllerImg: {
        // width: 147,
        // height: 82,
        resizeMode: "contain",
    },
    bottomContainer: {
        flexDirection: "row",
        flex: 2,
        width: screenWidth,
        justifyContent: "space-around",
        borderColor: "gray",
        borderTopWidth: 1,
        padding: 10,
    },
    bottomImg: {
        width: 50,
        height: 50,
    },
    backdrop: {
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    signPageMainContainer: {
        width: screenWidth,
        height: screenHeight,
        backgroundColor: "rgba(119,136,153,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    questionCard: {
        width: screenWidth * 0.9,
        height: screenHeight * 0.5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 10,
    },
    questionOptionRow: {
        flex: 3,
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    questionNumRow: {
        flex: 1,
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    questionNumBlock: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    questionOption: {
        flex: 1,
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    questionButton: {
        width: 25,
        height: 25,
        borderColor: "gray",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 50,
    },
    questionOptionImg: {
        width: 80,
        height: 80,
    },
    exitCard: {
        width: screenWidth * 0.9,
        height: screenHeight * 0.2,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 10,
    },
    questionAnalysisModal: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: screenWidth,
        height: screenHeight,
        backgroundColor: "rgba(119,136,153,0.7)",
    },
});
