import React from "react";
import {
    TouchableWithoutFeedback,
    StyleSheet,
    View,
    Image,
    Alert,
    ImageBackground,
} from "react-native";
import { Icon, Input, Text, Button, Layout } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import'../../utils/global/constants.js';

const AlertIcon = (props) => <Icon {...props} name="alert-circle-outline" />;

export default Login = () => {
    const navigation = useNavigation();
    const [Name, setName] = React.useState("ming6002");
    const [Password, setPassword] = React.useState("2020");
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };
    //密码显隐图标
    const renderEyeIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
        </TouchableWithoutFeedback>
    );

    //提示密码alert
    const renderPasswordCaption = () => {
        return (
            <View style={styles.captionContainer}>
                {AlertIcon(styles.captionIcon)}
                <Text style={styles.captionText}>请输入密码 </Text>
            </View>
        );
    };
    //提示用户名alert
    const renderNameCaption = () => {
        return (
            <View style={styles.captionContainer}>
                {AlertIcon(styles.captionIcon)}
                <Text style={styles.captionText}>请输入用户名</Text>
            </View>
        );
    };
    const handleLogin = () => {

        const param = {
            userName: Name,
            passWord: Password,
        }

        fetch( global.constants.baseUrl
                +'userManage_login.do?' 
                + 'userName=' + param.userName 
                + '&passWord=' + param.passWord 
                + '&callback=ha'
                )
            
            .then(response => response.text())
            .then(text => {
                let res = eval('('+text.substring(2)+')')
                //console.log(res)
                //console.log(res.data.STUDENT.userId)
                if(res.success==true){
                    //设置全局信息
                    global.constants.userName = res.data.STUDENT.userName
                    global.constants.token = res.data.token
                    global.constants.userId = res.data.STUDENT.userId
                    global.constants.userPhoto = res.data.STUDENT.userPhoto
                    Alert.alert(res.message)
                    navigation.navigate("Home")
                }
                else if(res.success==false){
                    Alert.alert(res.message)
                }

            })
            .catch(err => console.log('Request Failed', err));
        
            
        };
        //渲染
        return (
            <View style={styles.View}>
                <Layout style={styles.Layout}>
                    <Image
                        source={require("../../assets/image/bottomWave.jpg")}
                        style={styles.ImageBottom}
                    />
                </Layout>
                <Image
                    source={require("../../assets/image/91.png")}
                    style={styles.Image}
                />
                <Input
                    value={Name}
                    placeholder="请输入用户名"
                    //caption={renderNameCaption}
                    accessoryLeft={<Icon name="person" />}
                    onChangeText={(nextValue) => setName(nextValue)}
                    style={styles.Input}
                />

                <Input
                    value={Password}
                    placeholder="请输入密码"
                    //caption={renderPasswordCaption}
                    accessoryLeft={<Icon name="lock" />}
                    accessoryRight={renderEyeIcon}
                    secureTextEntry={secureTextEntry}
                    onChangeText={(nextValue) => setPassword(nextValue)}
                    style={styles.Input}
                />
                <Button onPress={() => handleLogin(true)} style={styles.Button}>
                    登 录
                </Button>
            </View>
        )
    }

    const styles = StyleSheet.create({
        View: {
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
        },
        captionContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        captionIcon: {
            width: 10,
            height: 10,
            marginRight: 5,
        },
        captionText: {
            fontSize: 12,
            fontWeight: "400",
            fontFamily: "opensans-regular",
            color: "#8F9BB3",
        },
        Image: {
            alignItems: "center",
            margin: 20,
        },
        Input: {
            alignItems: "center",
            width: "80%",
            paddingTop: 15,
            backgroundColor: "#fff",
            fontStyle: {
                color: "#000",
            },
        },
        Button: {
            margin: 20,
            width: "70%",
        },
        Layout: {
            position: "absolute",
            bottom: 0,
        },
        ImageBottom: {
            position: "relative",
            flex: 1,
        },
    });
