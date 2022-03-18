import { show } from "antd-mobile/es/components/dialog/show";
import React, { Component, useState, useEffect, useRef } from "react";
import {
    View,
    Button,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Text
} from "react-native";
import ShowAnswer from "./ShowAnswer";

class SeeAnswerButton extends Component {
    constructor(props) {
        super(props);
        //初始化props参数
        this.state = {
            token: global.constants.token,
            userName: global.constants.userName,
            ip: global.constants.baseUrl,
            questionId: this.props.questionId,
            sourceId: this.props.sourceId,
            subjectId: this.props.subjectId,
            basetypeId: this.props.basetypeId,
        }
    }
    handleSubmit() {
        console.log('查看参考答案按钮')
        this.props.setShow(false)
    }

    render() {

        return (
            <View style={styles.Button}>

                <Button
                    onPress={() => this.handleSubmit()}
                    title="查看答案"
                    color="#59B9E0"
                />

            </View>
        )
    }
}
export default SeeAnswerButton;

const styles = StyleSheet.create({
    Button: {


    }
})