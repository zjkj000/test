import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Image,
} from "react-native";
import { Button, InputItem, Icon } from '@ant-design/react-native';


export default class Login1 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <InputItem
                    clear
                    error
                    value={this.state.value}
                    onChange={value => {
                    this.setState({
                        value,
                        });
                    }}
                    placeholder="请输入用户名"
            >
                {/* <Icon
                    name="team"
                /> */}
                    
                
            </InputItem>
                {/* <View style={styles.item}>
                    <Text style={styles.textStyle}>用户帐号：</Text>
                    <TextInput
                        ref="inputLoginName"
                        autoFocus={true}
                        underlineColorAndroid="gray"
                        placeholder="请输入用户名"
                        clearTextOnFocus={true}
                        clearButtonMode="while-editing"
                        style={{ flex: 1 }}
                        onChangeText={(input) =>
                            this.setState({ username: input })
                        }
                    ></TextInput>
                </View>
                <View style={styles.item}>
                    <Text style={styles.textStyle}>用户密码：</Text>
                    <TextInput
                        ref="inputLoginPwd"
                        underlineColorAndroid="gray"
                        placeholder="请输入密码"
                        clearTextOnFocus={true}
                        clearButtonMode="while-editing"
                        style={{ flex: 1 }}
                        onChangeText={(input) =>
                            this.setState({ userpwd: input })
                        }
                    ></TextInput>
                </View>
                <TouchableHighlight
                    style={styles.login}
                    underlayColor="transparent"
                    onPress={() => this.loginInMainpage()}
                >
                    <Text style={styles.loginText}>登录</Text>
                </TouchableHighlight> */}
             

            
            </View>
        );
    }

    /**
     * 登录进入主页面
     */
    loginInMainpage() {
        this.inputLoginName.blur();
        this.inputLoginPwd.blur();
        this.props.navigation.navigate("MainPage", {
            logName: this.state.username,
            logPwd: this.state.userpwd,
            parentComponent: this,
            ...this.props,
        });
    }

    setLoginName(input) {
        this.setState = { inputName: input };
    }

    setLoginPwd(input) {
        this.setState = { inputPwd: input };
    }
}



//样式style
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        margin: 10,
    },
    textStyle: {
        fontSize: 18,
        color: "black",
        marginRight: 10,
    },
    login: {
        height: 40,
        backgroundColor: "green",
        margin: 20,
        justifyContent: "center",
    },
    loginText: {
        fontSize: 20,
        alignSelf: "center",
        color: "#FFF",
    },
});
