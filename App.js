import React, { Component } from "react";
import { Text,TextInput } from "react-native";
import MainNavigation from "./src/Components/Navigation/MainNavigation";
import "react-native-get-random-values";
import { NavigationContainer } from "@react-navigation/native";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { default as theme } from "./src/theme/custom-theme.json";


TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {defaultProps: false})
Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false})

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <IconRegistry icons={EvaIconsPack} />
                <ApplicationProvider
                    {...eva}
                    theme={{ ...eva.light, ...theme }}
                >
                    <NavigationContainer>
                        <MainNavigation />
                    </NavigationContainer>
                </ApplicationProvider>
            </>
        );
    }
}
