import React, { Component } from "react";
import { Image, View } from "react-native";
import { styles } from "../styles";

export default class TempPage extends Component {
    render() {
        return (
            <View style={styles.mainContainer}>
                <Image source={require("../../../assets/stuImg/qing1.png")} />
            </View>
        );
    }
}
