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
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { default as theme } from "./src/theme/custom-theme.json";
>>>>>>> 83a5b9b2c31fbffab1b1782cc7337a11f950ad1a

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
                <ApplicationProvider
                    {...eva}
                    theme={{ ...eva.light, ...theme }}
                >
>>>>>>> 83a5b9b2c31fbffab1b1782cc7337a11f950ad1a
                    <NavigationContainer>
                        <MainNavigation />
                    </NavigationContainer>
                </ApplicationProvider>
            </>
        );
    }
}
