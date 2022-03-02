import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
_this = null;
class Loading extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { show, list } = this.props;
        const color = this.props.color ? this.props.color : '#59B9E0';
        const background = this.props.background ? true : false;
        if (show) {
            return (
                <View style={styles.LoadingPage}>
                    <View
                        style={
                            background ? styles.hasBackground : styles.Loading
                        }
                    >
                        <ActivityIndicator size="large" color={color} />
                        <Text
                            style={{
                                marginLeft: 10,
                                color: color,
                                marginTop: 10,
                            }}
                        >
                            正在加载...
                        </Text>
                    </View>
                </View>
            );
        } else {
            return typeof list === "function" && list();
        }
    }
}
export default Loading;
const styles = StyleSheet.create({
    LoadingPage: {
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: "rgba(0,0,0,0)",
        width: width,
        height: height,
        justifyContent: "center",
        alignItems: "center",
    },
    Loading: {
        width: 100,
        height: 100,
        opacity: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 7,
    },
    hasBackground: {
        width: 100,
        height: 100,
        opacity: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 7,
        backgroundColor: "rgba(0,0,0,0.6)",
    },
});
