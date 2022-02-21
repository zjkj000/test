import React, { Component } from "react";
import { Text, Dimensions, StyleSheet, TouchableHighlight } from "react-native";

class ButtonBasic extends Component {
    constructor(props) {
        super(props);

        let styleList = [styles.basicButton];
        if (props.buttonSize == 2)
            styleList = [...styleList, styles.doubleButton];
        else if (props.buttonSize == 3)
            styleList = [...styleList, styles.tripleButton];
        if (props.type == "operator")
            styleList = [...styleList, styles.operationButton];
        else if (props.type == "setting")
            styleList = [...styleList, styles.settingButton];

        this.state = {
            styleList: styleList,
        };
    }

    render() {
        return (
            <TouchableHighlight
                onPress={() =>
                    this.props.onClick(this.props.label, this.props.type)
                }
            >
                <Text style={this.state.styleList}>{this.props.label}</Text>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    basicButton: {
        fontSize: 40,
        height: Dimensions.get("window").width / 4,
        width: Dimensions.get("window").width / 4,
        padding: 20,
        backgroundColor: "#414141",
        color: "#FFFFFF",
        textAlign: "center",
        borderWidth: 1,
        borderColor: "#000000",
    },
    operationButton: {
        color: "#FFF",
        backgroundColor: "#FA8231",
    },
    settingButton: {
        color: "#000000",
        backgroundColor: "#F0F0F0",
    },
    doubleButton: {
        width: (Dimensions.get("window").width / 4) * 2,
    },
    tripleButton: {
        width: (Dimensions.get("window").width / 4) * 3,
    },
});

export default ButtonBasic;
