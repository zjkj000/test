import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
} from "react-native";
import React, { Component } from "react";
import RadioList from "../Utils/RadioList";
import HTMLView from "react-native-htmlview";

//  阅读题 模板页面
//  使用时 需要传入三个参数：  sum   num  datasource
//  需要传的参数有三个，第一个是共多少题，第二个是当前是第index题 这里用了的（index+1）显示第几题。 第三个是试题数据。

export default class Answer_single extends Component {
    constructor(props) {
        super(props);
        this.state = {
            closeopenstate: true,
            numid: "",
            questionTypeName: "阅读题",
            questionId: "",
            baseTypeId: "",
            questionName: "", //题目名称
            questionChoiceList: 0, //选项个数
            questionContent: "", //题目内容
            answer: "",
        };
    }

    UNSAFE_componentWillMount() {
        this.setState({ numid: this.props.num, ...this.props.datasource });
    }

    render() {
        const HTML = this.state.questionContent;
        const questionChoiceList = this.state.questionChoiceList;

        //为了动态加在选项个数  阅读题默认都是ABCD选项
        var items = [];
        for (
            var read_num_i = 0;
            read_num_i < questionChoiceList;
            read_num_i++
        ) {
            items.push(
                <View key={read_num_i} style={styles.answer_result}>
                    <Text style={{ fontSize: 20, width: 25 }}>
                        {read_num_i + 1}
                    </Text>
                    <RadioList ChoiceList={"A,B,C,D"} />
                </View>
            );
        }
        return (
            <View>
                {/* 第一行显示 第几题  题目类型 */}
                <View style={styles.answer_title}>
                    <Text>
                        {" "}
                        {this.state.numid + 1}/{this.props.sum}题
                    </Text>
                    <Text style={{ marginLeft: 20 }}>
                        {this.state.questionTypeName}
                    </Text>
                </View>

                {/* 题目展示区域 */}
                <ScrollView
                    style={
                        this.state.closeopenstate
                            ? styles.answer_area
                            : styles.answer_area_open
                    }
                >
                    <HTMLView value={HTML} />
                    <Text style={{ height: 50 }}></Text>
                </ScrollView>

                {/* 答案区域 */}
                <View
                    style={
                        this.state.closeopenstate
                            ? styles.answer_result_area
                            : styles.answer_result_area_open
                    }
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                closeopenstate: !this.state.closeopenstate,
                            });
                        }}
                    >
                        <Image
                            style={{ position: "relative", left: "65%" }}
                            source={require("../../../../assets/image3/closeopen.png")}
                        ></Image>
                    </TouchableOpacity>
                    {/* 分割线 */}
                    <View
                        style={{
                            backgroundColor: "#000000",
                            height: 1,
                            width: "100%",
                        }}
                    ></View>
                    <ScrollView>
                        {/* item是根据题目中小题个数，动态加载的 */}
                        {items}
                        {/* 下面这个view是为了解决选项在最低端加载显示不全的问题，写个空白的区域，将最下面的顶上来 */}
                        <View style={{ height: 30 }}></View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    answer_title: { padding: 10, paddingLeft: 30, flexDirection: "row" },
    answer_area: { height: "66%", padding: 20 },
    answer_result_area: { height: "27%" },
    answer_area_open: { height: "45%", padding: 20 },
    answer_result_area_open: { height: "48%" },
    answer_result: {
        flexDirection: "row",
        justifyContent: "center",
        paddingLeft: 20,
        alignItems: "center",
    },
});
