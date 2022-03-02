import { useNavigation, useRoute } from "@react-navigation/native";
import React, { Component } from "react";
import { View, Text, StyleSheet, Image, BackHandler } from "react-native";
import Orientation from "react-native-orientation";
import { styles } from "./styles";

export default function OnlineClassTempPage() {
    const navigation = useNavigation();
    const route = useRoute();
    return <OnlineClassTemp navigation={navigation} route={route} />;
}

class OnlineClassTemp extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Orientation.lockToLandscape();
        if (Platform.OS === "android") {
            BackHandler.addEventListener(
                "hardwareBackPress",
                this.onBackAndroid
            );
        }
    }

    componentWillUnmount() {
        Orientation.lockToPortrait();
        if (Platform.OS === "android") {
            BackHandler.addEventListener(
                "hardwareBackPress",
                this.onBackAndroid
            );
        }
    }
    onBackAndroid() {
        if (
            this.props.navigation.state.params &&
            this.props.navigation.state.params.showDialog
        ) {
            //当dialog存在时，先消失dialog   然后返回true ，不执行系统默认操作
            this.props.navigation.setParams({
                showDialog: false,
            });
            return true;
        } else {
            //返回false ，不执行系统默认操作
            return false;
        }
    }

    render() {
        const routeParams = this.props.route.params;
        console.log(routeParams);
        console.log(typeof routeParams);
        // const { courseName, introduction, teacherName } = routeParams.learnPlan;
        return (
            <View style={styles.mainContainer}>
                <Image source={require("../../assets/image/music.png")}></Image>
                <Text>课堂:{routeParams.learnPlan.courseName}</Text>
                <Text>教师:{routeParams.learnPlan.teacherName}</Text>
                <Text>学生:{routeParams.learnPlan.introduction}</Text>
            </View>
        );
    }
}
