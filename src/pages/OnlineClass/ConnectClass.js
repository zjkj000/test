import { useNavigation } from "@react-navigation/native";
import React, { Component, useState } from "react";
import { View } from "react-native";

export default ConnectClass = () => {
    const navigation = useNavigation();
    const [ipAddress, setIpAddress] = useState("");

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
    );
};
