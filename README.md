# test

用于测试 git

## 2022.2.22 路由框架

### MainNavigation 组件

该组件用于集中处理组件间路由，需要路由的页面无论层级，都暂时写到该组件内，写法如下：

```react
<Stack.Screen name="Login" component={Login} />
```

其中 Login 为页面组件
之后在页面中如果需要跳转到该页面，只需要使用如下方式进行跳转：

```react
import { useNavigation } from "@react-navigation/native";
...
const navigation = useNavigation()
navigation.navigate("Login");
```

注意 useNavigation()只能被使用在函数组件中，如果是类组件，请在该组件外包裹一层函数，将 navigation 作为参数传入类组件，详见 React Navigation 指南

### TabBar 组件

该组件用于渲染底部导航栏，包含：

1. 首页
2. 线上课程
3. 错题本
4. 我的

四个页面，分别通过四个`renderXXXX`函数进行渲染，将写好的页面组件通过这四个 render 函数渲染即可

### 页面逻辑

App.js 负责渲染 MainNavigation 组件，并用 navigationContainer 将其包裹，搭建路由结构。MainNavigation 默认路由为 Login 组件。
Login 组件用于渲染登录页面，处理登录事件后跳转至 TabBar.js 组件，该组件用于渲染底部导航栏。

### utils

-   增加 http 组件，用于完成网络请求。
    -   httpBaseConfig.js 用于配置 API 的 URL
    -   使用时引入 http 类后，根据需求调用 get，post 等函数即可，需要传入调用 API 的相对地址，以及需要传递的参数 param，param 可以为空
-   增加 loading 组件，用于渲染 loading 界面
-   增加 PlaceHolder 组件，用于渲染骨架屏
-   增加 Screen 组件，用于获取设备的宽高
-   增加 TwiceTap 组件，用于为其他组件绑定点两次返回键推出应用的功能

## 2022.2.23 增加我的页面

### UI 组件库 React Native UI Kitten

该组件库基于 EVA Design 开发，使用时安装如下依赖：

```shell
yarn add @ui-kitten/components @eva-design/eva react-native-svg
```

然后在`App.js`中使用`ApplicationProvider`将其包裹,并且，为了能够使用 eva 图标库（该 UI 库推荐的图标库），还需要安装如下依赖：

```shell
yarn add @ui-kitten/eva-icons react-native-svg
```

然后同样在`App.js`中注册，最终整合到其中的写法如下：

```react
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
```

### 我的页面

在该页面中实现自定义头部，头像，以及各种按钮。
其中需要调取摄像头权限，进行拍照并更换头像。
头像使用 Avatar 控件，并通过 Overflow Menu 设置弹出页，通过弹出页面选择拍照或是从图库中直接选择。

## 2022.2.28 增加线上课堂界面

### 连接界面

改页面主要实现输入 IP 地址，点击连接按钮进行连接，跳转到 Temp 界面显示课堂信息并强制横屏。
使用如下方式实现强制横屏，增加点击输入框弹出历史记录的功能，增加可点击图标以便后期增加扫码功能。

### Temp 界面

显示课堂信息，并强制横屏，阻止返回事件：
使用如下组件为组件添加监听横屏事件：

```shell
yarn add react-native-orientation
```

该组件为我们提供了一些控制横竖屏的操作，例如：

```react
import Orientation from "react-native-orientation";
Orientation.lockToLandscape();
Orientation.lockToPortrait();
```

接下来只需要在组件的挂载和卸载生命周期中添加监听事件即可。

使用如下组件进行安卓返回操作的阻拦：

```react
import {
    BackHandler,
} from 'react-native';

```

定义监听 Back 按键处理函数：

```react
onBackAndroid() {

        if(this.props.navigation.state.params&&this.props.navigation.state.params.showDialog){//当dialog存在时，先消失dialog   然后返回true ，不执行系统默认操作
            this.props.navigation.setParams({
                showDialog:false
            })
            return true;
        }else{//返回false ，不执行系统默认操作
            return false;
        }

    }
```

注册监听事件：

```react
 componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }

    }
```

取消监听事件：

```react
 componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }

    }
```

## My 页面更新：

为修改密码功能增加弹出框，但输入框间距有待调整。

## 2022.3.2 增加扫码组件和通知组件

### 今日任务

-   扫码组件（未测试）
-   通知组件（实现并测试）

### 具体实现

#### 通知组件

通知组件使用如下第三放组件进行实现：

```shell
yarn add rn-overlay
```

使用时在 index.js 中全局引入该组件：

```react
import "rn-overlay";

```

之后使用则只需要从`react-native`中引入即可：

```react
import { Overlay } from "react-native";
```

封装时使用类`Toast`，将不同类型的弹出框设置为该类的类函数：

```react
import { Easing, Overlay } from "react-native";

const toast = Overlay.Toast;

export default class Toast {
    static showDangerToast(message) {
        toast.show(message, 3000, {
            textStyle: {
                backgroundColor: "#FFD6B3",
                color: "#7A0C10",
                borderWidth: 0,
            },
            position: toast.Position.Top,
            animateEasing: Easing.in(Easing.bounce),
        });
    }
    static showSuccessToast(message) {
        toast.show(message, 3000, {
            textStyle: {
                backgroundColor: "#C0F9B1",
                color: "#0A5E2E",
                borderWidth: 0,
            },
            position: toast.Position.Top,
            animateEasing: Easing.in(Easing.bounce),
        });
    }
    static showWarningToast(message) {
        toast.show(message, 2000, {
            textStyle: {
                backgroundColor: "#FFF9A4",
                color: "#7A6C05",
                borderWidth: 0,
            },
            position: toast.Position.Top,
            animateEasing: Easing.in(Easing.bounce),
        });
    }
    static showInfoToast(message) {
        toast.show(message, 3000, {
            textStyle: {
                backgroundColor: "#9FD9FF",
                color: "#02247A",
                borderWidth: 0,
            },
            position: toast.Position.Top,
            animateEasing: Easing.in(Easing.bounce),
        });
    }
}
```

每个函数均接受参数：`message`，该参数用于表示需要在弹出框中显示的文字。该弹出框会根据 `message` 的内容动态调整大小.

Overlay 中的 Toast 函数接收如下参数：

-   message ：必须，需要显示的消息
-   duration ：非必须，消息框显示的时长，默认为 3000
-   option ：非必须，接收一个 styles 对象，其中应包含`textStyle`属性，用于定义弹出框的样式
-   position ：非必须，接收一个 toast.Position 中的参数，用于指定弹出框出现的位置，默认为中间，
-   animateEasing ：非必须，接收一个 React Native 中定义的 Easing 对象，用于定义弹出框的动画
