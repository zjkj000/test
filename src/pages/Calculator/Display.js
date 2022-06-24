import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import http from "../../utils/http/request";
const styles = StyleSheet.create({
    display: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        alignItems: "flex-end",
    },
    displayValue: {
        fontSize: 30,
        color: "#FFF",
    },
});

export default class Display extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
        };
    }

    handleRequest() {
        let param = {
            userName: "mingming",
            classTimeId: "50648",
            type: "3",
            // 'callback': 'ha'
        };
        http.get("teacherApp_lookNotice.do", param)
            .then((res) => {
                // console.log(res);
                let data = JSON.parse(res);
                this.setState({
                    message: data.message,
                });
                // console.log(data);
            })
            .catch((error) => {
                // console.log(error);
            });
    }

    componentDidMount() {
        // this.handleRequest();
    }

    render() {
        return (
            <View style={styles.display}>
                <Text style={styles.displayValue}>
                    {this.props.value}
                    {/* {this.state.message} */}
                </Text>
            </View>
        );
    }
}
