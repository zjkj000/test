import React, { Component } from "react";
import { SafeAreaView, View } from "react-native";
import MainNavigation from "./src/Components/Navigation/MainNavigation";
import "react-native-get-random-values";
import { NavigationContainer, navigationRef } from "@react-navigation/native";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <IconRegistry icons={EvaIconsPack} />
                <ApplicationProvider {...eva} theme={eva.light}>
                    <NavigationContainer>
                        <MainNavigation />
                    </NavigationContainer>
                </ApplicationProvider>
            </>
        );
    }
}
