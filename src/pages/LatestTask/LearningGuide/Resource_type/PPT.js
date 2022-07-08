import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    Dimensions,
} from "react-native";
import React, { Component, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function PPTContainer(props) {
    const navigation = useNavigation();
    const learnPlanId = props.learnPlanId;
    const submit_status = props.submit_status;
    const startdate = props.startdate;
    const papername = props.papername;
    const sum = props.sum;
    const num = props.num;
    const datasource = props.datasource;

    return (
        <PPT
            navigation={navigation}
            papername={papername}
            submit_status={submit_status}
            startdate={startdate}
            learnPlanId={learnPlanId}
            sum={sum}
            num={num}
            isallObj={props.isallObj}
            datasource={datasource}
        />
    );
}
//  PPT展示

class PPT extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numid: "",
            resourceName: "",
            resourceId: "",
            baseTypeId: "",
            questionName: "", //题目名称
            questionChoiceList: "", //题目选项
            question: "", //题目内容

            uri: "",
            pptList: [],
            selectedindex: 0, //记录当前选中的是哪张ppt
        };
    }

    UNSAFE_componentWillMount() {
        //请求到之后  就要把答案 设置到oldstuanswer
        this.setState({
            uri: this.props.datasource.pptList[0],
            pptList: this.props.datasource.pptList,

            numid: this.props.num ? this.props.num : 0,
            ...this.props.datasource,
        });
    }

    getPPT(pptList) {
        var pptItems = [];
        for (let ppt_i = 0; ppt_i < pptList.length; ppt_i++) {
            pptItems.push(
                <TouchableOpacity
                    key={ppt_i}
                    onPress={() =>
                        this.setState({
                            selectedindex: ppt_i,
                            uri: pptList[ppt_i],
                        })
                    }
                >
                    <Image
                        source={{ uri: pptList[ppt_i] }}
                        style={
                            this.state.selectedindex == ppt_i
                                ? styles.checked
                                : styles.little_image
                        }
                    />
                </TouchableOpacity>
            );
        }
        return pptItems;
    }
    render() {
        const width = Dimensions.get("window").width;
        return (
            <View
                style={{
                    backgroundColor: "#FFFFFF",
                    borderTopColor: "#000000",
                    borderTopWidth: 0.5,
                }}
            >
                {/* 第一行显示 第几题  题目类型 */}
                <View style={styles.title}>
                    <Text
                        style={{
                            fontWeight: "600",
                            color: "#000000",
                            fontSize: 17,
                            width: "65%",
                        }}
                    >
                        {this.state.resourceName}
                    </Text>
                </View>

                {/* 展示PPT就行 */}

                <View style={styles.area}>
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>
                        {this.state.resourceName}
                    </Text>
                    <Image
                        style={{ width: "90%", height: 250 }}
                        source={{ uri: this.state.uri }}
                    ></Image>
                    <ScrollView horizontal={true} style={{ marginTop: 80 }}>
                        {this.getPPT(this.state.pptList)}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: { padding: 10, paddingLeft: 30, flexDirection: "row" },
    area: { alignItems: "center", height: "100%", paddingTop: "35%" },
    little_image: { height: 50, width: 80, marginLeft: 5 },
    checked: {
        height: 50,
        width: 80,
        marginLeft: 5,
        borderColor: "#FFA500",
        borderWidth: 2,
    },
});
