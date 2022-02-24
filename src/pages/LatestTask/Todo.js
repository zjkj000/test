import React from 'react';
import {
    StyleSheet,
    View,
    Text,
} from "react-native";

export default class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
         <View>
            <Text>做任务</Text>
         </View>
    );
  }
}

const styles = StyleSheet.create({

});