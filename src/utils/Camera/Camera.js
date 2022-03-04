import { launchCamera, launchImageLibrary } from "react-native-image-picker";

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
        let resImg = null;
        await launchCamera(option, (response) => {
            if (response.didCancel) {
                return;
            }
            console.log(response)
            resImg = response.assets[0];

        });
        return resImg;
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
