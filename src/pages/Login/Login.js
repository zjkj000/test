import React, { useEffect } from "react";
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
import "../../utils/global/constants.js";
import Loading from "../../utils/loading/Loading";
import Toast from "../../utils/Toast/Toast.js";
import StorageUtil from "../../utils/Storage/Storage";

const AlertIcon = (props) => <Icon {...props} name="alert-circle-outline" />;

// let LoginName = "";
// let LoginPassword = "";
let changeLogin = false;

export default Login = () => {
    const navigation = useNavigation();
    const [Name, setName] = React.useState(function getInitName() {
        //console.log("获取缓存账户名以及密码");
        StorageUtil.get("namePassword").then((res) => {
            console.log("获取缓存账户名以及密码111"  , res);
            if (res) {
                //LoginName = res.loginName;
                //console.log("缓存中的账户名：" , LoginName);
                return res.loginName;
            }else{
                //console.log("缓存中的账户名为空");
                //LoginName = "";
                return "";
            }
        });
    });
    const [Password, setPassword] = React.useState(function getInitPassword() {
        StorageUtil.get("namePassword").then((res) => {
            //console.log("获取缓存账户名以及密码222"  , res);
            if (res) {
                //LoginPassword = res.loginPassword;
                //console.log("缓存中的密码：" , LoginPassword);
                return res.loginPassword;
            }else{
                //console.log("缓存中的密码为空");
                //LoginPassword = "";
                return "";
            }
        });
    });
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);
    const [showLoading, setShowLoading] = React.useState(false);
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
        };
        setShowLoading(true);
        fetch(
            global.constants.baseUrl +
                "userManage_login.do?" +
                "userName=" +
                param.userName +
                "&passWord=" +
                param.passWord +
                "&callback=ha"
        )
            .then((response) => response.text())
            .then((text) => {
                console.log("************接口返回数据****************", text);
                let res = eval("(" + text.substring(2) + ")");
                console.log("************接口返回数据********res********", res);
                let homePage = "Home";
                let property = "STUDENT";
                let userType = "STUDENT";
                if ("COMMON_TEACHER" in res.data) {
                    homePage = "Teacher_Home";
                    property = "COMMON_TEACHER";
                    userType = "TEACHER";
                } else if ("ADMIN_TEACHER" in res.data) {
                    homePage = "Teacher_Home";
                    property = "ADMIN_TEACHER";
                    userType = "TEACHER";
                }
                if (res.success == true) {
                    console.log("************接口返回数据*****111***********", text);
                    StorageUtil.get("namePassword").then((res) => {
                        console.log("登录账户名以及密码111: " , res);
                        if (res) {
                            if(res.loginName != Name){
                                let propertys = {
                                    loginName: Name,
                                    loginPassword:  Password
                                };
                                StorageUtil.save("namePassword" , propertys);
                            }
                        }else{
                            let propertys = {
                                loginName: Name,
                                loginPassword:  Password
                            };
                            StorageUtil.save("namePassword" , propertys);
                        }

                        console.log("登录账户名以及密码222: " , res);
                    });
                    //console.log(res.data.STUDENT.userId)
                    //设置全局信息
                    global.constants.company = res.data[property].company;
                    global.constants.isadmin = res.data[property].isadmin; //1普通教师  2管理员
                    global.constants.dcompany = res.data[property].dcompany;
                    global.constants.userName = res.data[property].userName;
                    global.constants.token = res.data.token;
                    global.constants.userId = res.data[property].userName;  //这里的userId  和 userName 都以后都要用UserName
                    global.constants.passWord = param.passWord;
                    global.constants.userPhoto = res.data[property].userPhoto;
                    global.constants.userCn = res.data[property].cn;
                    global.constants.userType = userType;
                    setShowLoading(false);
                    // Toast.showSuccessToast(res.message, 500);
                    // Alert.alert(res.message);
                    navigation.navigate({
                        name: homePage,
                        params: {
                            userName: param.userName,
                        },
                    });
                } else if (res.success == false) {
                    console.log("************接口返回数据********222********", text);
                    setShowLoading(false);
                    Toast.showWarningToast(
                        "用户名密码错误！请重新输入！",
                        2000
                    );
                    // Alert.alert(res.message);
                }
            })
            .catch((err) => {
                setShowLoading(false);
                Toast.showDangerToast("用户名密码错误！请重新输入！", 2000);
            });
    };

    const getStorageUtil_name = () => {
        console.log("************getStorageUtil*****111*****")
        StorageUtil.get("namePassword").then((res) => {
            if (res) {
                //LoginName = res.loginName;
                //LoginPassword = res.loginPassword;
                setName(res.loginName);
            }else{
                //LoginName = "";
                //LoginPassword = "";
            }
        });
    }

    const getStorageUtil_Password = () => {
        console.log("************getStorageUtil*****222*****")
        StorageUtil.get("namePassword").then((res) => {
            if (res) {
                setPassword(res.loginPassword);
            }else{
                //LoginName = "";
                //LoginPassword = "";
            }
        });
    }

    //渲染
    return (
        <View style={styles.View}>
            {
                (Name == null || Name == "") && changeLogin == false  ? getStorageUtil_name() : null
            }
            {
                (Password == null || Password == "") && changeLogin == false ? getStorageUtil_Password() : null
            }
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
            {/* {console.log("--------缓存中的账户名和密码-------" , Name , Password)} */}
            <Input
                value={Name}
                placeholder="请输入用户名"
                //caption={renderNameCaption}
                accessoryLeft={<Icon name="person" />}
                onChangeText={(nextValue) => {
                    console.log("nextValue类型" , typeof(nextValue) , nextValue);
                    //LoginName = nextValue;
                    changeLogin = true;
                    setName(nextValue)
                }}
                style={styles.Input}
            />

            <Input
                value={Password}
                placeholder="请输入密码"
                //caption={renderPasswordCaption}
                accessoryLeft={<Icon name="lock" />}
                accessoryRight={renderEyeIcon}
                secureTextEntry={secureTextEntry}
                onChangeText={(nextValue) => {
                    //LoginPassword = nextValue;
                    changeLogin = true;
                    setPassword(nextValue)
                }}
                style={styles.Input}
            />
            <Button
                onPress={() => {
                    if (Name == "") {
                        Toast.showWarningToast("请输入用户名", 1000);
                    } else if (Password == "") {
                        Toast.showWarningToast("请输入密码", 1000);
                    } else {
                        handleLogin(true);
                        console.log("************输入的账户名和密码是****************", Name , Password);
                    }
                }}
                style={styles.Button}
            >
                登 录
            </Button>
            <Loading show={showLoading}></Loading>
        </View>
    );
};

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
        marginTop: 100,
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
