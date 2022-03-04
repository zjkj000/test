import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
    },
    preview: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    rectangleContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    rectangle: {
        height: 198,
        width: 200,
        borderWidth: 1,
        borderColor: "#fcb602",
        backgroundColor: "transparent",
    },
    rectangleText: {
        flex: 0,
        color: "#fff",
        marginTop: 10,
    },
    border: {
        flex: 0,
        width: 196,
        height: 2,
        backgroundColor: "#fcb602",
    },
});
