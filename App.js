import React, { Component } from "react";
import { SafeAreaView, View } from "react-native";
import MainNavigation from "./src/Components/Navigation/MainNavigation";
import "react-native-get-random-values";
import { NavigationContainer, navigationRef } from "@react-navigation/native";
<<<<<<< HEAD
import { ApplicationProvider , IconRegistry} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as theme } from './src/theme/custom-theme.json';
=======
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
>>>>>>> aeca67833dbf826b6a2ec125e9b148992229e461

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <IconRegistry icons={EvaIconsPack} />
<<<<<<< HEAD
                <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>
=======
                <ApplicationProvider {...eva} theme={eva.light}>
>>>>>>> aeca67833dbf826b6a2ec125e9b148992229e461
                    <NavigationContainer>
                        <MainNavigation />
                    </NavigationContainer>
                </ApplicationProvider>
            </>
        );
    }
}
