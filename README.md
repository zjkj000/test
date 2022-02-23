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
