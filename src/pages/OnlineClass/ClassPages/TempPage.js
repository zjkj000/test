import { Layout, Button, Modal, Card } from "@ui-kitten/components";
import React, { Component } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { styles } from "../styles";

export default class TempPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }
    render() {
        const { userName, introduction, imgURL } = this.props;
        return (
            <View style={styles.mainContainer}>
                <Layout style={styles.header}>
                    <Layout style={styles.header_left}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ visible: true });
                            }}
                        >
                            <Image
                                source={require("../../../assets/classImg/subj.png")}
                                style={styles.smallImg}
                            />
                        </TouchableOpacity>
                    </Layout>
                    <Layout style={styles.header_middle}></Layout>
                    <Layout
                        style={{
                            ...styles.header_right,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text>{introduction + "(" + userName + ")"}</Text>
                    </Layout>
                </Layout>
                <Layout style={{ ...styles.body, flexDirection: "column" }}>
                    <Image
                        source={require("../../../assets/stuImg/qing.png")}
                    />
                    <Text style={styles.alertFont}>
                        老师正在讲解，请看大屏幕
                    </Text>
                </Layout>
                <Modal
                    visible={this.state.visible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.setState({ visible: false })}
                >
                    <Image
                        style={styles.QRCode}
                        source={{ uri: imgURL }}
                    ></Image>
                </Modal>
            </View>
        );
    }
}
