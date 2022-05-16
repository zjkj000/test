import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";

class SpliteLine extends PureComponent {
    render() {
        let { lineHeight, color, style, contentStyle } = this.props;
        return (
            <View style={{ backgroundColor: "white", ...contentStyle }}>
                <View
                    style={[
                        {
                            height: 0,
                            borderTopWidth: lineHeight,
                            borderColor: color,
                            opacity: 0.7,
                            margin: StyleSheet.hairlineWidth,
                        },
                        style,
                    ]}
                />
            </View>
        );
    }
}

SpliteLine.defaultProps = {
    lineHeight: StyleSheet.hairlineWidth,
    color: "#bdbdbd",
    contentStyle: {},
};

export default SpliteLine;
