import { RNCamera } from "react-native-camera";
import React, { useCallback, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";

/**
 * hook 写法
 */
export default function QRCodeScanner() {
    const [flash, setFlash] = useState(false);
    const onBarCodeRead = useCallback((result) => {
        const { data } = result;
        //扫码后的操作 /// 这里会多次触发
        console.log(data);
    }, []);
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
                    flash
                        ? RNCamera.Constants.FlashMode.torch
                        : RNCamera.Constants.FlashMode.off
                } /*相机闪光模式*/
                onBarCodeRead={onBarCodeRead}
            >
                <View
                    style={{
                        width: 500,
                        height: 220,
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                />

                <View style={[{ flexDirection: "row" }]}>
                    <View
                        style={{
                            backgroundColor: "rgba(0,0,0,0.5)",
                            height: 200,
                            width: 200,
                        }}
                    />
                    <View style={{ width: 200, height: 200 }}>
                        {/* 这里暂时不加扫描动画-后续自行编辑-也可参考链接的博客*/}
                        {/* <Animated.View style={[
                                styles.border,
                                { transform: [{ translateY: this.state.moveAnim }] }]} /> */}
                    </View>
                    <View
                        style={{
                            backgroundColor: "rgba(0,0,0,0.5)",
                            height: 200,
                            width: 200,
                        }}
                    />
                </View>

                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(255, 0, 0, 0.5)",
                        width: 500,
                        alignItems: "center",
                    }}
                >
                    <Text style={styles.rectangleText}>
                        将二维码放入框内，即可自动扫描
                    </Text>
                    <Button
                        onPress={() => {
                            setFlash(!flash);
                        }}
                        title={(flash ? "关闭" : "打开") + "闪光灯"}
                    />
                </View>
            </RNCamera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
    },
    preview: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    rectangleContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    rectangle: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: "#fcb602",
        backgroundColor: "transparent",
        borderRadius: 10,
    },
    rectangleText: {
        flex: 0,
        color: "#fff",
        marginTop: 10,
    },
    border: {
        flex: 0,
        width: 196,
        height: 2,
        backgroundColor: "#fcb602",
        borderRadius: 50,
    },
});
