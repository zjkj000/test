import React from "react";
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade,
} from "rn-placeholder";
import { StyleSheet, ScrollView, View } from "react-native";

const Title = (hasTitle) => {
    return hasTitle ? (
        <Placeholder style={styles.title}>
            <PlaceholderLine />
        </Placeholder>
    ) : null;
};
const Placeholders = (props) => {
    const {
        ParagraphLength,
        hasTitle,
        firstLineWidth,
        lastLineWidth,
        width,
        style,
    } = props;
    const PlaceholderContent = [];
    let widthList = Array(ParagraphLength).fill(width);
    widthList[0] = firstLineWidth ? firstLineWidth : width;
    widthList[widthList.length - 1] = lastLineWidth ? lastLineWidth : width;
    for (let key = 0; key < ParagraphLength; key++) {
        PlaceholderContent.push(
            <Placeholder
                Animation={Fade}
                style={styles.item}
                key={`PlaceholderContentKey${key}`}
            >
                {Title(hasTitle)}
                <PlaceholderLine width={widthList[key]} style={{ ...style }} />
            </Placeholder>
        );
    }
    return (
        <ScrollView style={{ margin: 10 }}>
            {PlaceholderContent.map((item) => item)}
        </ScrollView>
    );
};

const ImageContent = (props) => {
    const baseOption = {
        ParagraphLength: 5,
        hasTitle: false,
        style: {
            margin: 10,
        },
        lastLineWidth: 60,
    };
    const options = { ...baseOption, ...props };
    const { isLoading, list } = props;

    if (isLoading) {
        return Placeholders(options);
    }
    return typeof list === "function" && list();
};

const Paragraph = (props) => {
    const baseOption = {
        style: {
            margin: 5,
        },
        width: 90,
        lastLineWidth: 70,
        firstLineWidth: 50,
    };

    const options = { ...baseOption, ...props };
    const { isLoading, list } = props;

    if (isLoading) {
        return Placeholders(options);
    }
    return typeof list === "function" && list();
};

/* 导出
 ============================================================ */
const ImagePlaceholder = ImageContent;
const ParagraphPlaceholder = Paragraph;
export { ImagePlaceholder, ParagraphPlaceholder };

/* 样式
 ============================================================ */
const styles = StyleSheet.create({
    title: {
        marginBottom: 12,
    },
    item: {
        margin: 12,
    },
});
