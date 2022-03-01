import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../../utils/Screen/GetSize";

export const styles = StyleSheet.create({
    myCard: {
        width: (screenWidth * 90) / 100,
        height: (screenWidth * 80) / 100,
        alignItems: "center",
        // flexDirection: "column",
        padding: 2,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    cardInput: {
        alignItems: "center",
        width: "100%",
        backgroundColor: "#fff",
        fontStyle: {
            color: "#000",
        },
        margin: 5,
    },
    buttonContainer: {
        flexDirection: "row",
    },
    cardButton: {
        flex: 1,
        margin: 10,
    },
    header: {
        width: screenWidth,
        height: screenHeight / 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 600,
        elevation: 10,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    avatar: {
        width: screenWidth,
        height: screenHeight / 6,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        flexDirection: "column",
    },
    layout: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarImg: {
        width: 100,
        height: 100,
    },
    button: {
        margin: 2,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    alternativeContainer: {
        borderRadius: 4,
        marginVertical: 2,
        padding: 5,
        flexDirection: "row",
    },
    textLeft: {
        margin: 2,
        fontSize: 18,
        flex: 1,
        textAlign: "left",
    },
    textRight: {
        margin: 2,
        fontSize: 18,
        flex: 1,
        textAlign: "right",
    },
    icon: {
        width: 16,
        height: 16,
    },
    button: {
        borderRadius: 0,
    },
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});
