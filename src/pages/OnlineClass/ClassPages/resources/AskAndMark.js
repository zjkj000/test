import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
} from "react-native";
import {
    Button,
    Layout,
    Modal,
    Card,
    OverflowMenu,
    MenuItem,
    Input,
} from "@ui-kitten/components";
import SpliteLine from "../../../../utils/SpliteLine/SpliteLine";
import { styles } from "../../styles";
import Item from "@ant-design/react-native/lib/list/ListItem";

export default class AskAndMark extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flgVisible: false,
            askVisible: false,
            flagList: ["I'm flag one", "I'm flag two", "I'm flag three"],
            askList: ["I'm ask one", "I'm ask two", "I'm ask three"],
        };
    }
    render() {
        return (
            <>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ flgVisible: true });
                    }}
                >
                    <Image
                        style={styles.flgImg}
                        source={require("../../../../assets/classImg/flag.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ askVisible: true });
                    }}
                >
                    <Image
                        style={styles.askImg}
                        source={require("../../../../assets/classImg/ask.png")}
                    />
                </TouchableOpacity>
                <Modal
                    visible={this.state.flgVisible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.setState({ flgVisible: false })}
                >
                    <View style={styles.myCard}>
                        <Text style={styles.cardTitle}>添加标记</Text>
                        <SpliteLine lineHeight={1} style={{ margin: 2 }} />
                        <Layout style={styles.cardBar}>
                            <Input style={styles.cardInput}></Input>
                        </Layout>
                        <SpliteLine lineHeight={1} style={{ margin: 2 }} />
                        <Layout style={styles.cardBar}>
                            <ScrollView style={styles.cardHistoryList}>
                                {this.state.flagList.map((item, index) => {
                                    return <Text>{`${index}. ${item}`}</Text>;
                                })}
                            </ScrollView>
                        </Layout>
                        <SpliteLine lineHeight={1} style={{ margin: 2 }} />
                        <Layout style={styles.cardBar}>
                            <Button
                                onPress={() =>
                                    this.setState({ flgVisible: false })
                                }
                                appearance={"ghost"}
                            >
                                取消
                            </Button>
                            <Button
                                onPress={() =>
                                    this.setState({ flgVisible: false })
                                }
                                appearance={"ghost"}
                            >
                                保存
                            </Button>
                        </Layout>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.askVisible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.setState({ askVisible: false })}
                >
                    <View style={styles.myCard}>
                        <Text style={styles.cardTitle}>添加问题</Text>
                        <SpliteLine lineHeight={1} style={{ margin: 2 }} />
                        <Layout style={styles.cardBar}>
                            <Input style={styles.cardInput}></Input>
                        </Layout>
                        <SpliteLine lineHeight={1} style={{ margin: 2 }} />
                        <Layout style={styles.cardBar}>
                            <ScrollView style={styles.cardHistoryList}>
                                {this.state.askList.map((item, index) => {
                                    return <Text>{`${index}. ${item}`}</Text>;
                                })}
                            </ScrollView>
                        </Layout>
                        <SpliteLine lineHeight={1} style={{ margin: 2 }} />
                        <Layout style={styles.cardBar}>
                            <Button
                                onPress={() =>
                                    this.setState({ flgVisible: false })
                                }
                                appearance={"ghost"}
                            >
                                取消
                            </Button>
                            <Button
                                onPress={() =>
                                    this.setState({ flgVisible: false })
                                }
                                appearance={"ghost"}
                            >
                                保存
                            </Button>
                        </Layout>
                    </View>
                </Modal>
            </>
        );
    }
}
