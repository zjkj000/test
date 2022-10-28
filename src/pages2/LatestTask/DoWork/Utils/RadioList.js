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
import RadioGroup from "./RadioGroup";

// 这个是封装过的单选按钮，根据选项值  进行设置。
export default class RadioList extends PureComponent {
    constructor(props) {
        super(props);
        this.checkedAnswer = this.checkedAnswer.bind(this);
        this.state = {
            questionChoiceList: [],
            type: "single",
            TimuIndex: "",
            sexArray: [],
            StuAnswer: "",
        };
    }

    //把作答结果传给 单选题 、 判断题  （根据type传给阅读题的小题） 只有单选变了才会执行，没变就不执行
    checkedAnswer(selectindex) {
        const NewStuAnswer = this.state.sexArray[selectindex].title;
        if (NewStuAnswer == this.state.StuAnswer) {
            //选项没变就不执行
        } else {
            //选项变了就执行
            this.setState({
                StuAnswer: this.state.sexArray[selectindex].title,
            });
            if (this.state.type == "single") {
                //单选题这么执行，只用给回传选了哪个
                this.props.getstuanswer(NewStuAnswer);
            } else {
                //阅读题回传需要告诉是第几题在选答案
                this.props.getstuanswer(this.state.TimuIndex, NewStuAnswer);
            }
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.ChoiceList !== this.props.ChoiceList) {
            const list = this.props.ChoiceList.split(",");

            const NewsexArray = [];
            list.map(function (item, index) {
                let image_new = "";
                let image2_new = "";
                if (item == "A") {
                    image_new = require("../../../../assets/image3/10.png");
                    image2_new = require("../../../../assets/image3/20.png");
                } else if (item == "B") {
                    image_new = require("../../../../assets/image3/11.png");
                    image2_new = require("../../../../assets/image3/21.png");
                } else if (item == "C") {
                    image_new = require("../../../../assets/image3/12.png");
                    image2_new = require("../../../../assets/image3/22.png");
                } else if (item == "D") {
                    image_new = require("../../../../assets/image3/13.png");
                    image2_new = require("../../../../assets/image3/23.png");
                } else if (item == "E") {
                    image_new = require("../../../../assets/image3/E.png");
                    image2_new = require("../../../../assets/image3/E1.png");
                } else if (item == "F") {
                    image_new = require("../../../../assets/image3/F.png");
                    image2_new = require("../../../../assets/image3/F1.png");
                } else if (item == "G") {
                    image_new = require("../../../../assets/image3/G.png");
                    image2_new = require("../../../../assets/image3/G1.png");
                } else if (item == "H") {
                    image_new = require("../../../../assets/image3/H.png");
                    image2_new = require("../../../../assets/image3/H1.png");
                } else if (item == "对") {
                    image_new = require("../../../../assets/image3/T.png");
                    image2_new = require("../../../../assets/image3/T1.png");
                } else if (item == "错") {
                    image_new = require("../../../../assets/image3/R.png");
                    image2_new = require("../../../../assets/image3/R1.png");
                } else {
                    image_new = "";
                    image2_new = "";
                }
                NewsexArray.push({
                    title: item,
                    image: image_new,
                    image2: image2_new,
                });
            });
            this.setState({
                TimuIndex: this.props.TimuIndex ? this.props.TimuIndex : 0,
                type: this.props.type ? this.props.type : "single",
                questionChoiceList: list,
                sexArray: NewsexArray,
                StuAnswer:
                    this.props.checkedindexID == "未答"
                        ? ""
                        : this.props.checkedindexID,
            });
        }
        if (prevProps.checkedindexID != this.props.checkedindexID) {
            this.setState({
                StuAnswer:
                    this.props.checkedindexID == "未答"
                        ? ""
                        : this.props.checkedindexID,
            });
        }
    }
    UNSAFE_componentWillMount() {
        const list = this.props.ChoiceList.split(",");
        const NewsexArray = [];
        list.map(function (item, index) {
            let image_new = "";
            let image2_new = "";
            if (item == "A") {
                image_new = require("../../../../assets/image3/10.png");
                image2_new = require("../../../../assets/image3/20.png");
            } else if (item == "B") {
                image_new = require("../../../../assets/image3/11.png");
                image2_new = require("../../../../assets/image3/21.png");
            } else if (item == "C") {
                image_new = require("../../../../assets/image3/12.png");
                image2_new = require("../../../../assets/image3/22.png");
            } else if (item == "D") {
                image_new = require("../../../../assets/image3/13.png");
                image2_new = require("../../../../assets/image3/23.png");
            } else if (item == "E") {
                image_new = require("../../../../assets/image3/E.png");
                image2_new = require("../../../../assets/image3/E1.png");
            } else if (item == "F") {
                image_new = require("../../../../assets/image3/F.png");
                image2_new = require("../../../../assets/image3/F1.png");
            } else if (item == "G") {
                image_new = require("../../../../assets/image3/G.png");
                image2_new = require("../../../../assets/image3/G1.png");
            } else if (item == "H") {
                image_new = require("../../../../assets/image3/H.png");
                image2_new = require("../../../../assets/image3/H1.png");
            } else if (item == "对") {
                image_new = require("../../../../assets/image3/T.png");
                image2_new = require("../../../../assets/image3/T1.png");
            } else if (item == "错") {
                image_new = require("../../../../assets/image3/R.png");
                image2_new = require("../../../../assets/image3/R1.png");
            } else {
                image_new = "";
                image2_new = "";
            }
            NewsexArray.push({
                title: item,
                image: image_new,
                image2: image2_new,
            });
        });
        this.setState({
            TimuIndex: this.props.TimuIndex ? this.props.TimuIndex : 0,
            type: this.props.type ? this.props.type : "single",
            questionChoiceList: list,
            sexArray: NewsexArray,
            StuAnswer:
                this.props.checkedindexID == "未答"
                    ? ""
                    : this.props.checkedindexID,
        });
    }

    render() {
        const incheckedindex =
            this.state.StuAnswer == "A"
                ? 0
                : this.state.StuAnswer == "B"
                ? 1
                : this.state.StuAnswer == "C"
                ? 2
                : this.state.StuAnswer == "D"
                ? 3
                : this.state.StuAnswer == "E"
                ? 4
                : this.state.StuAnswer == "F"
                ? 5
                : this.state.StuAnswer == "G"
                ? 6
                : this.state.StuAnswer == "H"
                ? 7
                : this.state.StuAnswer == "对"
                ? 0
                : this.state.StuAnswer == "错"
                ? 1
                : -1;
        return (
            <View style={{ height: 44, flex: 1, marginTop: 5 }}>
                <RadioGroup
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }} //整个组件的样式----这样可以垂直和水平
                    conTainStyle={{ height: 44, width:55 }} //图片和文字的容器样式
                    imageStyle={{ width: 35, height: 35 }} //图片样式
                    textStyle={{ color: "black" }} //文字样式
                    selectIndex={incheckedindex} //空字符串,表示不选中,数组索引表示默认选中
                    data={this.state.sexArray} //数据源
                    getcheckedAnswer={this.checkedAnswer}
                />
            </View>
        );
    }
}
