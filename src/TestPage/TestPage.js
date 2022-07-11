import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "./styles";

export default class TestPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNum: 0,
            imgState: 1,
        };
    }
    render() {
        return (
            <View style={styles.mainContent}>
                <TouchableOpacity
                    onPress={() => {
                        let { showNum, imgState } = this.state;
                        this.setState({
                            showNum: showNum + 1,
                            imgState: !imgState,
                        });
                    }}
                >
                    <Image
                        source={
                            this.state.imgState
                                ? require("../assets/teacherLatestPage/tianjia.png")
                                : require("../assets/teacherLatestPage/shanchu.png")
                        }
                    ></Image>
                </TouchableOpacity>
                <Text>现在是数字：{this.state.showNum}</Text>
            </View>
        );
    }
}
