import Reactotron, { networking } from "reactotron-react-native";
Reactotron.configure() // controls connection & communication settings
    .useReactNative(networking()) // add all built-in react native plugins
    .connect(); // let's connect!
