import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";

import RadiosGroup from "./RadiosGroup";

// 这个是封装的复选框
export default class Checkbox extends PureComponent {
    constructor(props) {
        super(props);
        this.checkedAnswer = this.checkedAnswer.bind(this);
        this.state = {
            questionChoiceList: [],
            sexArray: [],
            StuAnswer: "",
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ChoiceList !== this.props.ChoiceList) {
            const list = this.props.ChoiceList.split(",");
            const NewsexArray = [];
            list.map(function (item, index) {
                let image_new = "";
                let image2_new = "";
                if (item == "A") {
                    image_new = require("../../../../assets/image3/DA.png");
                    image2_new = require("../../../../assets/image3/DA1.png");
                } else if (item == "B") {
                    image_new = require("../../../../assets/image3/DB.png");
                    image2_new = require("../../../../assets/image3/DB1.png");
                } else if (item == "C") {
                    image_new = require("../../../../assets/image3/DC.png");
                    image2_new = require("../../../../assets/image3/DC1.png");
                } else if (item == "D") {
                    image_new = require("../../../../assets/image3/DD.png");
                    image2_new = require("../../../../assets/image3/DD1.png");
                } else if (item == "E") {
                    image_new = require("../../../../assets/image3/DE.png");
                    image2_new = require("../../../../assets/image3/DE1.png");
                } else if (item == "F") {
                    image_new = require("../../../../assets/image3/DF.png");
                    image2_new = require("../../../../assets/image3/DF1.png");
                } else if (item == "G") {
                    image_new = require("../../../../assets/image3/DG.png");
                    image2_new = require("../../../../assets/image3/DG1.png");
                } else {
                    image_new = require("../../../../assets/image3/DH.png");
                    image2_new = require("../../../../assets/image3/DH1.png");
                }
                NewsexArray.push({
                    title: item,
                    image: image_new,
                    image2: image2_new,
                    selected: false,
                });
            });
            this.setState({
                StuAnswer: this.props.checkedlist,
                questionChoiceList: list,
                sexArray: NewsexArray,
            });
        }
        if (prevProps.checkedlist !== this.props.checkedlist) {
            this.setState({
                StuAnswer: this.props.checkedlist,
            });
        }
    }

    //将多选每次改变的结果传给ToDo
    checkedAnswer(title) {
        const NewStuAnswer = this.state.StuAnswer.split(",");
        if (NewStuAnswer.includes(title)) {
            NewStuAnswer.splice(NewStuAnswer.indexOf(title), 1);
            //console.log('删除了',title)
        } else {
            //console.log('选中了',title)
            NewStuAnswer.push(title);
        }
        var changedAnswer = "";
        if (NewStuAnswer.includes("A")) {
            changedAnswer += "A";
        }
        if (NewStuAnswer.includes("B")) {
            changedAnswer += ",B";
        }
        if (NewStuAnswer.includes("C")) {
            changedAnswer += ",C";
        }
        if (NewStuAnswer.includes("D")) {
            changedAnswer += ",D";
        }
        if (NewStuAnswer.includes("E")) {
            changedAnswer += ",E";
        }
        if (NewStuAnswer.includes("F")) {
            changedAnswer += ",F";
        }
        if (NewStuAnswer.includes("G")) {
            changedAnswer += ",G";
        }
        if (NewStuAnswer.includes("H")) {
            changedAnswer += ",H";
        }
        if (changedAnswer[0] == ",") {
            changedAnswer = changedAnswer.substring(1);
        }

        this.setState({ StuAnswer: changedAnswer });
        this.props.getstuanswer(changedAnswer);
    }

    UNSAFE_componentWillMount() {
        const list = this.props.ChoiceList.split(",");
        const NewsexArray = [];
        list.map(function (item, index) {
            let image_new = "";
            let image2_new = "";
            if (item == "A") {
                image_new = require("../../../../assets/image3/DA.png");
                image2_new = require("../../../../assets/image3/DA1.png");
            } else if (item == "B") {
                image_new = require("../../../../assets/image3/DB.png");
                image2_new = require("../../../../assets/image3/DB1.png");
            } else if (item == "C") {
                image_new = require("../../../../assets/image3/DC.png");
                image2_new = require("../../../../assets/image3/DC1.png");
            } else if (item == "D") {
                image_new = require("../../../../assets/image3/DD.png");
                image2_new = require("../../../../assets/image3/DD1.png");
            } else if (item == "E") {
                image_new = require("../../../../assets/image3/DE.png");
                image2_new = require("../../../../assets/image3/DE1.png");
            } else if (item == "F") {
                image_new = require("../../../../assets/image3/DF.png");
                image2_new = require("../../../../assets/image3/DF1.png");
            } else if (item == "G") {
                image_new = require("../../../../assets/image3/DG.png");
                image2_new = require("../../../../assets/image3/DG1.png");
            } else {
                image_new = require("../../../../assets/image3/DH.png");
                image2_new = require("../../../../assets/image3/DH1.png");
            }
            NewsexArray.push({
                title: item,
                image: image_new,
                image2: image2_new,
                selected: false,
            });
        });
        this.setState({
            StuAnswer: this.props.checkedlist,
            questionChoiceList: list,
            sexArray: NewsexArray,
        });
    }

    render() {
        return (
            <View style={{ height: 44, flex: 1, marginTop: 5 }}>
                {/* {setquestionChoiceList} */}
                <RadiosGroup
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }} //整个组件的样式----这样可以垂直和水平
                    conTainStyle={{ height: 44, width: 60 }} //图片和文字的容器样式
                    imageStyle={{ width: 35, height: 35 }} //图片样式
                    textStyle={{ color: "black" }} //文字样式
                    data={this.state.sexArray} //数据源
                    onPress={() => {}}
                    getcheckedAnswer={this.checkedAnswer}
                    checkedlist={this.state.StuAnswer}
                />
            </View>
        );
    }
}
