import React, { Component } from "react";
import { View, Text } from "react-native";

export default class MyPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text>我是我的页面</Text>
            </View>
        );
    }
}
