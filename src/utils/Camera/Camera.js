import { launchCamera, launchImageLibrary } from "  ";
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
            const grantedCamera = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "学习一点通请求访问您的摄像头权限",
                    message: "学习一点通需要获得摄像头权限以拍摄照片",
                    buttonNeutral: "稍后询问",
                    buttonNegative: "不允许",
                    buttonPositive: "允许",
                }
            );
            const grantedStorage = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "学习一点通请求访问您的读写文件",
                    message:
                        "学习一点通需要获取读写文件权限以保存拍摄得到的照片",
                    buttonNeutral: "稍后询问",
                    buttonNegative: "不允许",
                    buttonPositive: "允许",
                }
            );
            if (
                grantedCamera === PermissionsAndroid.RESULTS.GRANTED &&
                grantedStorage === PermissionsAndroid.RESULTS.GRANTED
            ) {
                console.log("You have the permission of camera");
                let resImg = null;
                await launchCamera(option, (response) => {
                    if (response.didCancel) {
                        return;
                    }
                    console.log(
                        "CameraPermission===================================="
                    );
                    console.log(response);
                    console.log("====================================");
                    resImg = response.assets[0];
                });
                return resImg;
            } else {
                console.log("Camera permission denied");
            }
        } catch (error) {
            console.warn(error.toString());
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
            console.log(
                "LibraryPermission===================================="
            );
            console.log(response);
            console.log("====================================");
            resImg = response.assets[0];
        });
        return resImg;
    }
}
