import React, { Component } from "react";
import {
    Button,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ShadowPropTypesIOS,
} from "react-native";

export default class RadiosGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [false, false, false, false, false, false, false, false],
            data: [],
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.checkedlist !== this.props.checkedlist) {
            const oldchecklist = this.props.checkedlist.split(",");
            const oldselected = this.state.selected;
            oldchecklist.map(function (item, index) {
                if (item == "A") {
                    oldselected[0] = true;
                } else if (item == "B") {
                    oldselected[1] = true;
                } else if (item == "C") {
                    oldselected[2] = true;
                } else if (item == "D") {
                    oldselected[3] = true;
                } else if (item == "E") {
                    oldselected[4] = true;
                } else if (item == "F") {
                    oldselected[5] = true;
                } else if (item == "G") {
                    oldselected[6] = true;
                } else if (item == "H") {
                    oldselected[7] = true;
                } else {
                }
            });
            this.setState({ data: this.props.data, selected: oldselected });
        }
    }

    UNSAFE_componentWillMount() {
        //  this.props.checkedlist  是哪个已经选中了
        const oldchecklist = this.props.checkedlist.split(",");
        const oldselected = this.state.selected;
        oldchecklist.map(function (item, index) {
            if (item == "A") {
                oldselected[0] = true;
            } else if (item == "B") {
                oldselected[1] = true;
            } else if (item == "C") {
                oldselected[2] = true;
            } else if (item == "D") {
                oldselected[3] = true;
            } else if (item == "E") {
                oldselected[4] = true;
            } else if (item == "F") {
                oldselected[5] = true;
            } else if (item == "G") {
                oldselected[6] = true;
            } else if (item == "H") {
                oldselected[7] = true;
            } else {
            }
        });
        this.setState({ data: this.props.data, selected: oldselected });
    }

    render() {
        let newArray = this.state.data;
        return (
            <View style={[this.props.style]}>
                {newArray.map((item, index) =>
                    this.renderRadioButton(
                        newArray,
                        item,
                        this.onPress,
                        index,
                        this.state.selected
                    )
                )}
            </View>
        );
    }

    onPress = (index, item) => {
        let array = this.props.data;
        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            if (i == index) {
                this.state.selected[i] = !this.state.selected[i];
                this.setState({ selected: this.state.selected });
            }
        }
    };

    renderRadioButton(array, item, onPress, index, selected) {
        // image 未选中时
        let image = item.image;
        if (selected[index] == true) {
            image = item.image2;
        } else {
            image = item.image;
        }
        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    onPress(index, item);
                    this.props.getcheckedAnswer(item.title);
                }}
                style={[
                    {
                        width: 100,
                        height: 43,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    },
                    this.props.conTainStyle,
                ]}
            >
                <Image
                    style={[{ width: 25, height: 25 }, this.props.imageStyle]}
                    source={image}
                />
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: "white",
    },
});
