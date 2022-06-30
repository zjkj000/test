import { Layout } from "@ui-kitten/components";
import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Modal,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { screenWidth, screenHeight } from "../Screen/GetSize";

/** 放大图片弹窗组件 */
class ZoomPictureModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowImage: this.props.isShowImage,
            loadingAnimating: true,
            zoomImages: this.props.zoomImages,
            currShowImgIndex: this.props.currShowImgIndex,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isShowImage != this.props.isShowImage) {
            this.setState({
                isShowImage: this.props.isShowImage,
            });
        }
        if (prevProps.zoomImages != this.props.zoomImages) {
            this.setState({
                zoomImages: this.props.zoomImages,
            });
        }
        if (prevProps.currShowImgIndex != this.props.currShowImgIndex) {
            console.log("ZoomModelUpdate====================================");
            console.log(this.props.currShowImgIndex);
            console.log("====================================");
            this.setState({
                currShowImgIndex: this.props.currShowImgIndex,
            });
        }
    }

    handleZoomPicture(flag) {
        this.setState({
            isShowImage: flag,
        });
        this.props.callBack(flag);
    }

    // 保存图片
    savePhoto() {
        // let index = this.props.curentImage;
        // let url = this.props.imaeDataUrl[index];
        // let promise = CameraRoll.saveToCameraRoll(url);
        // promise.then(function (result) {
        //    alert("已保存到系统相册")
        // }).catch(function (error) {
        //     alert('保存失败！\n' + error);
        // });
    }

    // 图片加载
    renderImageLoad() {
        let { loadingAnimating } = this.state;
        return (
            <View style={styles.img_load}>
                <ActivityIndicator
                    animating={loadingAnimating}
                    size={"large"}
                />
            </View>
        );
    }

    render() {
        let { isShowImage, zoomImages, currShowImgIndex } = this.state;
        console.log(
            "ZoomPictureModelRender===================================="
        );
        console.log(zoomImages);
        console.log(currShowImgIndex);
        console.log("====================================");
        return (
            <Layout>
                <Modal
                    visible={isShowImage}
                    animationType={"slide"}
                    transparent={true}
                >
                    <ImageViewer
                        style={styles.zoom_pic_img}
                        enableImageZoom={true}
                        saveToLocalByLongPress={false}
                        // menuContext={{ "saveToLocal": "保存图片", "cancel": "取消" }}
                        // onSave={(url) => { this.savePhoto(url) }}
                        // failImageSource={{
                        //     url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460', // 不能加载本地图片
                        //     width: Width(),
                        //     height: 300
                        // }}
                        // loadingRender={() => this.renderImageLoad()}
                        // enableSwipeDown={true}
                        imageUrls={zoomImages}
                        index={currShowImgIndex}
                        onClick={() => this.handleZoomPicture(false)}
                    />
                </Modal>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    zoom_pic_img: {
        // maxWidth: screenHeight,
    },
    img_load: {
        marginBottom: screenWidth / 2 - 40,
    },
});

export default ZoomPictureModel;
