import { useNavigation } from "@react-navigation/native";
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Orientation from "react-native-orientation";

export default function OnlineClassTempPage() {
    const navigation = useNavigation();
    return <OnlineClassTemp navigation={navigation} />;
}

class OnlineClassTemp extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Orientation.lockToLandscape();
    }

    componentWillUnmount() {
        Orientation.lockToPortrait();
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <Text>中间屏幕</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});
