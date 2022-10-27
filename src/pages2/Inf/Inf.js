import React from "react";
import { Button } from "@ant-design/react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgURL: "../../../assets/placeholdIMG.png",
        };
    }
    handleCamera = () => {
        const option = {
            title: "请选择",
            cancelButtonTitle: "取消",
            takePhotoButtonTitle: "拍照",
            chooseFromLibraryButtonTitle: "选择照片",
            includeBase64: true, // 拍照后生成base64字串
            quality: 1.0,
            allowsEditing: true,
            maxWidth: 500,
            maxHeight: 500,
            saveToPhotos: true,
            storageOptions: {
                skipBackup: true,
                path: "images",
            },
        };
        launchCamera(option, (response) => {
            console.log(response);
            if (response.didCancel) {
                return;
            }
            response = response.assets[0];
            console.log(response.base64);
            this.setState({
                imgURL: response.uri,
            });
        });

        // launchImageLIbrary(option, (response) => {
        //     console.log("Response = ", response);

        //     console.log(response);
        // });
    };
    handleLibrary = () => {
        const option = {
            title: "请选择",
            chooseFromLibraryButtonTitle: "选择照片",
            includeBase64: true, // 拍照后生成base64字串
            quality: 1.0,
            allowsEditing: true,
            maxWidth: 500,
            maxHeight: 500,
            saveToPhotos: true,
            storageOptions: {
                skipBackup: true,
                path: "images",
            },
        };
        launchImageLibrary(option, (response) => {
            console.log(response);
            if (response.didCancel) {
                return;
            }
            response = response.assets[0];
            console.log(response.base64);
            this.setState({
                imgURL: response.uri,
            });
        });
    };
    render() {
        return (
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                }}
            >
                <TouchableOpacity onPress={this.handleCamera}>
                    <View>
                        <Image
                            source={{ uri: this.state.imgURL }}
                            style={{
                                borderRadius: 100,
                                width: 200,
                                height: 200,
                                backgroundColor: "blue",
                                margin: 5,
                            }}
                        ></Image>
                    </View>
                </TouchableOpacity>
                <Button onPress={this.handleCamera}>
                    <Text>点我拍照</Text>
                </Button>
                <Button onPress={this.handleLibrary}>
                    <Text>点我选择照片</Text>
                </Button>
            </View>
        );
    }
}
