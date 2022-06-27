import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { tsConstructorType } from "@babel/types";
import { View, Text, StyleSheet } from "react-native";

export default class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const routeParams = this.props.route.params;
        // console.log(this.props.route.params?.post);
        const item = routeParams.article;
        // console.log(item);
        return (
            <View>
                <View style={styles.container}>
                    <Text style={styles.title}>{item.value.name}</Text>
                    <Text style={styles.content}>{item.value.description}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    title: {
        fontSize: 30,
        justifyContent: "center",
        alignContent: "center",
        color: "blue",
        margin: 10,
    },
    content: {
        fontSize: 15,
        color: "black",
        margin: 5,
    },
});
