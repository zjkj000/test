import React from 'react';
import { StyleSheet,View,Image,Alert} from 'react-native';
import { Layout, Text, ViewPager } from '@ui-kitten/components';
import Answer_single from './Answer_type/Answer_single';
import Answer_read from './Answer_type/Answer_read';
import Answer_judgement from './Answer_type/Answer_judgment';
import Answer_subjective from './Answer_type/Answer_subjective';
import Answer_multiple from './Answer_type/Answer_multiple';
import Submit from './Answer_type/Submit';

export default function ViewPager_ToDo() {

const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (     
      <ViewPager
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}>  
        <Layout
          style={styles.tab}
          level='2'>
          <Image  style={{position:'absolute',left:5,top:"45%"}}  source={require('../../../assets/image3/zuo_03.png')}></Image>
          <Image  style={{position:'absolute',right:5,top:"45%"}} source={require('../../../assets/image3/you_03.png')}></Image>
          <Answer_single/>
        </Layout>
        <Layout
          style={styles.tab}
          level='2'>
          <Image style={{position:'absolute',left:5,top:"45%"}} source={require('../../../assets/image3/zuo_03.png')}></Image>
          <Image style={{position:'absolute',right:5,top:"45%"}} source={require('../../../assets/image3/you_03.png')}></Image>
          <Answer_multiple/>
        </Layout>
        <Layout
          style={styles.tab}
          level='2'>
          <Image style={{position:'absolute',left:5,top:"45%"}} source={require('../../../assets/image3/zuo_03.png')}></Image>
          <Image style={{position:'absolute',right:5,top:"45%"}} source={require('../../../assets/image3/you_03.png')}></Image>
          <Answer_read/>
        </Layout>
        <Layout
          style={styles.tab}
          level='2'>
          <Image style={{position:'absolute',left:5,top:"45%"}} source={require('../../../assets/image3/zuo_03.png')}></Image>
          <Image style={{position:'absolute',right:5,top:"45%"}} source={require('../../../assets/image3/you_03.png')}></Image>
          <Answer_judgement/>
        </Layout>
        <Layout
          style={styles.tab}
          level='2'>
            <Image style={{position:'absolute',left:5,top:"45%"}} source={require('../../../assets/image3/zuo_03.png')}></Image>
          <Image style={{position:'absolute',right:5,top:"45%"}} source={require('../../../assets/image3/you_03.png')}></Image>
          <Answer_subjective/>
        </Layout>
        <Layout
          style={styles.tab}
          level='2'>
          <Submit/>
        </Layout>
      </ViewPager>
  );
};

const styles = StyleSheet.create({
  tab: {
    height: "100%",
  },
});