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
class WrongSubmitButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: global.constants.token,
            userName: global.constants.userName,
            ip: global.constants.baseUrl,
            questionId: this.props.questionId,
            sourceId: this.props.sourceId,
            subjectId: this.props.subjectId,
            basetypeId: this.props.basetypeId,
            value:''
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value
        });
    }
    //提交学生答案
     postData(){
        fetch(this.state.ip
            + 'studentApp_ErrorQueAnswer.do?'
            + 'userName=' + this.state.userName
            + '&token=' + this.state.token
            + '&subjectId=' + this.state.subjectId
            + '&stuAnswer=' + this.state.value
            + '&sourceId=' + this.state.sourceId
            + '&questionId=' + this.state.questionId
            + '&callback=ha'
        )

            .then(response => response.text())
            .then(text => {

                const res = eval('(' + text.substring(2) + ')')

            })
            .catch(err => console.log('Request Failed', err))

    }
    handleSubmit() {
        if(this.state.value==''){
            Alert.alert('请输入答案')
        }
        else{
           
            this.postData()
            this.props.setStuAnswer(this.state.value)
            this.props.setShow(false)
        }

        
    } 

    render() {
        return (
            <View style={styles.Button}>
                <Button
                    onPress={() => this.handleSubmit()}
                    title="提交答案"
                    color="#59B9E0"
                />
            </View>
        )
    }
}
export default WrongSubmitButton;

const styles = StyleSheet.create({
    Button: {


    }
})