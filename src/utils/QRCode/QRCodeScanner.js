import { RNCamera } from "react-native-camera";
import React, { Component, useCallback, useState } from "react";
import { StyleSheet, View, Animated, Text, Button, Easing } from "react-native";
import Toast from "../Toast/Toast";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "./styles";
import { screenHeight, screenWidth } from "../../utils/Screen/GetSize";
/**
 * hook 写法
 */

export default function QRCodeScanner() {
    const navigation = useNavigation();
    const route = useRoute();
    return (
        <QRCodeScannerPage
            navigation={navigation}
            route={route}
        ></QRCodeScannerPage>
    );
}

class QRCodeScannerPage extends Component {
    componentDidMount() {
        this.startAnimation();
    }

    constructor(props) {
        super(props);
        this.state = {
            flash: false,
            moveAnim: new Animated.Value(0),
        };
    }
    startAnimation = () => {
        this.state.moveAnim.setValue(0);
        Animated.timing(this.state.moveAnim, {
            toValue: -200,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => this.startAnimation());
    };

    onBarCodeRead = (result) => {
        const { navigation, route } = this.props;

        const { data } = result;
        if (route.params?.backPage) {
            let { backPage } = route.params;
            navigation.navigate({ ...backPage, params: { ipAddress: data } });
        } else {
            navigation.navigate({
                name: "Home",
                params: {
                    screen: "线上课程",
                    params: { ipAddress: data },
                },
                merge: true,
            });
        }
    };
    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    captureAudio={false}
                    autoFocus={RNCamera.Constants.AutoFocus.on} /*自动对焦*/
                    style={[styles.preview]}
                    type={
                        RNCamera.Constants.Type.back
                    } /*切换前后摄像头 front前back后*/
                    flashMode={
                        this.state.flash
                            ? RNCamera.Constants.FlashMode.torch
                            : RNCamera.Constants.FlashMode.off
                    } /*相机闪光模式*/
                    onBarCodeRead={this.onBarCodeRead}
                >
                    {/* <View style={styles.rectangleContainer}>
                        <View style={styles.rectangle} />
                        <Animated.View
                            style={[
                                styles.border,
                                {
                                    transform: [
                                        { translateY: this.state.moveAnim },
                                    ],
                                },
                            ]}
                        />
                        <Text style={styles.rectangleText}>
                            将二维码放入框内，即可自动扫描
                        </Text>
                    </View> */}
                    <View
                        style={{
                            width: screenWidth,
                            height: (screenHeight - 200) * 0.5,
                            backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                    />
                    <View style={{ flexDirection: "row" }}>
                        <View
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                height: 200,
                                width: (screenWidth - 200) * 0.5,
                            }}
                        />
                        <View
                            style={{
                                flexDirection: "column",
                                width: 200,
                                height: 200,
                            }}
                        >
                            <View style={styles.rectangle} />
                            <Animated.View
                                style={[
                                    styles.border,
                                    {
                                        transform: [
                                            { translateY: this.state.moveAnim },
                                        ],
                                    },
                                ]}
                            />
                        </View>
                        <View
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                height: 200,
                                width: (screenWidth - 200) * 0.5,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            height: (screenHeight - 200) * 0.5,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            width: screenWidth,
                            alignItems: "center",
                        }}
                    >
                        <Text style={styles.rectangleText}>
                            将二维码放入框内，即可自动扫描
                        </Text>
                        <Button
                            onPress={() => {
                                this.setState({ flash: !this.state.flash });
                            }}
                            title={
                                (this.state.flash ? "关闭" : "打开") + "闪光灯"
                            }
                        />
                    </View>
                </RNCamera>
            </View>
        );
    }
}
