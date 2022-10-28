import React, { Component } from "react";
import { nanoid } from "nanoid";
import { StyleSheet, View } from "react-native";
import ButtonBasic from "./ButtonBasic";
import Display from "./Display";

export default class Calculator extends Component {
    constructor() {
        super();
        this.state = {
            buttons: [
                [
                    { label: "AC", size: 3, type: "setting" },
                    { label: "/", size: 1, type: "operator" },
                ],
                [
                    { label: "7", size: 1, type: "number" },
                    { label: "8", size: 1, type: "number" },
                    { label: "9", size: 1, type: "number" },
                    { label: "*", size: 1, type: "operator" },
                ],
                [
                    { label: "4", size: 1, type: "number" },
                    { label: "5", size: 1, type: "number" },
                    { label: "6", size: 1, type: "number" },
                    { label: "-", size: 1, type: "operator" },
                ],
                [
                    { label: "1", size: 1, type: "number" },
                    { label: "2", size: 1, type: "number" },
                    { label: "3", size: 1, type: "number" },
                    { label: "+", size: 1, type: "operator" },
                ],
                [
                    { label: "0", size: 2, type: "number" },
                    { label: ".", size: 1, type: "number" },
                    { label: "=", size: 1, type: "operator" },
                ],
            ],
            displayValue: "0",
            valueQueue: [0, 0],
            floatPosition: [0, 0],
            operator: "+",
            currentIndex: 0,
        };
    }

    addDigits = (label) => {
        let { currentIndex, displayValue, floatPosition, valueQueue } =
            this.state;
        if (label == ".") {
            if (floatPosition[currentIndex] == 0) {
                floatPosition[currentIndex] = 1;
                displayValue += ".";
            }
        } else {
            displayValue =
                valueQueue[currentIndex] || floatPosition[currentIndex]
                    ? displayValue + label
                    : label;
            valueQueue[currentIndex] = floatPosition[currentIndex]
                ? parseFloat(displayValue)
                : parseInt(displayValue);
        }
        this.setState({
            currentIndex,
            valueQueue,
            displayValue,
            floatPosition,
        });
    };

    handleSetting = (label) => {
        if (label == "AC") {
            this.setState({
                displayValue: "0",
                valueQueue: [0, 0],
                floatPosition: [0, 0],
                operator: "+",
                currentIndex: 0,
            });
        }
    };

    handleOperator = (label) => {
        let {
            currentIndex,
            operator,
            displayValue,
            valueQueue,
            floatPosition,
        } = this.state;
        if (currentIndex === 0) {
            currentIndex = 1;
            operator = label;
        } else {
            try {
                valueQueue[0] = eval(
                    `${valueQueue[0]} ${operator} ${valueQueue[1]}`
                );
            } catch (e) {
                valueQueue[0] = this.state.valueQueue[0];
            }
            operator = label === "=" ? null : label;
        }
        valueQueue[1] = 0;
        floatPosition[1] = 0;
        displayValue = String(valueQueue[0]);
        this.setState({
            currentIndex,
            valueQueue,
            displayValue,
            operator,
            floatPosition,
        });
    };

    handleClick = (label, type) => {
        if (type == "number") this.addDigits(label);
        else if (type == "setting") this.handleSetting(label);
        else if (type == "operator") this.handleOperator(label);
    };

    buttonsRender = () => {
        const buttons = this.state.buttons;
        return buttons.map((row) => {
            return row.map((button) => {
                return (
                    <ButtonBasic
                        key={nanoid()}
                        type={button.type}
                        buttonSize={button.size}
                        label={button.label}
                        onClick={this.handleClick}
                    />
                );
            });
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Display value={this.state.displayValue} />
                <View style={styles.buttons}>{this.buttonsRender()}</View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttons: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
});
