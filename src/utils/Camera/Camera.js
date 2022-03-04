import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { PermissionsAndroid } from "react-native";

export default class ImageHandler {
    static async handleCamera() {
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
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Cool Photo App Camera Permission",
                    message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You have the permission of camera");
                let resImg = null;
                await launchCamera(option, (response) => {
                    if (response.didCancel) {
                        return;
                    }
                    resImg = response.assets[0];
                });
                return resImg;
            } else {
                console.log("Camera permission denied");
            }
        } catch (error) {
            console.warn(err);
        }
        // let resImg = null;
        // await launchCamera(option, (response) => {
        //     if (response.didCancel) {
        //         return;
        //     }
        //     resImg = response.assets[0];
        // });
        // return resImg;
    }
    static async handleLibrary() {
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
        let resImg = null;
        await launchImageLibrary(option, (response) => {
            if (response.didCancel) {
                return;
            }
            resImg = response.assets[0];
        });
        return resImg;
    }
}
