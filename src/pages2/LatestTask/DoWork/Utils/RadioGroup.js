import React, { Component } from "react";
import {
    Button,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from "react-native";

export default class RadioGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: "",
            data: [],
        };
    }
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                data: this.props.data,
            });
        }
        if (prevProps.selectIndex !== this.props.selectIndex) {
            this.setState({
                selectIndex: this.props.selectIndex,
            });
        }
    }
    UNSAFE_componentWillMount() {
        this.setState({
            selectIndex: this.props.selectIndex,
            data: this.props.data,
        });
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
                        this.state.selectIndex
                    )
                )}
            </View>
        );
    }

    onPress = (index, item) => {
        let array = this.state.data;
        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            item.select = false;
            if (i == index) {
                item.select = true;
            }
        }
        this.setState({ selectIndex: index });
    };

    renderRadioButton(array, item, onPress, index, selectIndex) {
        let image = item.image;
        if (selectIndex != -1 && index == selectIndex) {
            image = item.image2;
        } else {
            image = item.image;
        }
        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    onPress(index, item);
                    this.props.getcheckedAnswer(index);
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
                    key={index}
                    style={[{ width: 20, height: 20 }, this.props.imageStyle]}
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
