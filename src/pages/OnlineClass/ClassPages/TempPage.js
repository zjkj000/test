import React, { Component } from "react";
import { Image, Text, View } from "react-native";
import { styles } from "../styles";

export default class TempPage extends Component {
    render() {
        return (
            <View style={styles.mainContainer}>
                <Image source={require("../../../assets/stuImg/qing.png")} />
                <Text style={styles.alertFont}>请看大屏幕</Text>
            </View>
        );
    }
}
