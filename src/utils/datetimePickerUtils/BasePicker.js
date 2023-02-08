import React,{ Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import Picker from 'react-native-picker';

//这是一个时间选择器  两个参数：    
//modle={Date}       必须传  两个值选择   'Date'   'Time'
//selected={str}     选传   格式  'yyyy-MM-dd'  或者  'hh:mm:ss'
//setDateOrTime={this.setBeginDateTime}  必须传   this.function   这个函数会 接收到  给你返回选择的str格式'yyyy-MM-dd'  或者  'hh:mm:ss'

export default class BasePicker extends Component {
  constructor(props){
    super(props);
    this.state={
      modle:'',             //Date   Time  
      selectedDate:'',
      selectedTime:'',
    }
  }

  UNSAFE_componentWillMount(){
    if(this.props.selected==null|this.props.selected==''){
    var _dateStr=new Date().toISOString().substring(0,10)+' '+new Date().toISOString().substring(11,19)
       this.setState({modle:this.props.modle,
                      selectedDate:_dateStr.substring(0,10),
                      selectedTime:_dateStr.substring(11,19)})
    }else if(this.props.modle=='Date'){
       this.setState({selectedDate:this.props.selected,modle:this.props.modle})
    }else if(this.props.modle=='Time'){
      this.setState({selectedDate:this.props.selected,modle:this.props.modle})
    }
  }
  UNSAFE_componentWillReceiveProps(nextprops){
    if(nextprops.selected==null|nextprops.selected==''){
      var _dateStr=new Date().toISOString().substring(0,10)+' '+new Date().toISOString().substring(11,19)
         this.setState({modle:nextprops.modle,
                        selectedDate:_dateStr.substring(0,10),
                        selectedTime:_dateStr.substring(11,19)})
      }else if(nextprops.modle=='Date'){
         this.setState({selectedDate:nextprops.selected,modle:nextprops.modle})
      }else if(nextprops.modle=='Time'){
        this.setState({selectedDate:nextprops.selected,modle:nextprops.modle})
      }
  }
  componentWillUnmount(){
    Picker.hide()
  }
 
  //组装时间数据
  _createTimeData(){
    let time =[]
    let ss = [];
      for(let l=0;l<60;l++){
        ss.push(l+'秒');
              }
    let mm = [];
      for(let y = 0;y<60;y++){
        mm.push(y+'分');
              }
    let hh=[]
    for(let z=0;z<24;z++){
      hh.push(z+'时');
    }
    time.push(hh)
    time.push(mm)
    time.push(ss)
    return time

  }
  _showTimePicker() {
    var hh= ''
    var mm=''
    var ss= ''
    var dateStr = this.state.selectedTime
    hh=  dateStr.substring(0,2)
    mm=parseInt(dateStr.substring(3,5))
    ss=parseInt(dateStr.substring(6,8))
    Picker.init({
      pickerTitleText:'时间选择',
      pickerCancelBtnText:'取消',
      pickerConfirmBtnText:'确定',
      pickerTextEllipsisLen:6,
      pickerData: this._createTimeData(),
      selectedValue:[hh+'时',mm+'分',ss+'秒'],
      onPickerConfirm: (pickedValue, pickedIndex) => {
        var hh = pickedValue[0].substring(0,pickedValue[0].length-1)
        var mm = pickedValue[1].substring(0,pickedValue[1].length-1)
        var ss = pickedValue[2].substring(0,pickedValue[2].length-1)
        hh = hh.padStart(2,'0')
        mm = mm.padStart(2,'0')
        ss = ss.padStart(2,'0')
        let str = hh+':'+mm+':'+ss
        this.props.setDateOrTime(str)
        this.setState({selectedTime:str})
      },
    });
    Picker.show();
  }

  //组装日期数据
  _createDateData(){
    let date = [];
    var currDate_Year = new Date().toISOString().substring(0,4)
    for(let i=parseInt(currDate_Year);i<=parseInt(currDate_Year)+10;i++){
      let month = [];
      let day = [];
      if(i==parseInt(currDate_Year)){
        for(let j = parseInt(new Date().toISOString().substring(5,7));j<13;j++){
          if(j==parseInt(new Date().toISOString().substring(5,7))){
            let day = [];
            if(j === 2){
              for(let k=parseInt(new Date().toISOString().substring(8,10));k<29;k++){
                day.push(k+'日');
              }
              if(i%4 === 0){
                  day.push(29+'日');
              }
            }else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                for(let k=parseInt(new Date().toISOString().substring(8,10));k<32;k++){
                    day.push(k+'日');
                }
            }else{
                for(let k=parseInt(new Date().toISOString().substring(8,10));k<31;k++){
                    day.push(k+'日');
                }
            }
            let _month = {};
            _month[j+'月'] = day;
            month.push(_month);
          }else{
            let day = [];
            if(j === 2){
              for(let k=1;k<29;k++){
                day.push(k+'日');
              }
              if(i%4 === 0){
                  day.push(29+'日');
              }
            }else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                for(let k=1;k<32;k++){
                    day.push(k+'日');
                }
            }else{
                for(let k=1;k<31;k++){
                    day.push(k+'日');
                }
            }
            let _month = {};
            _month[j+'月'] = day;
            month.push(_month);
          }
          
        }


      }else{
        for(let j = 1;j<13;j++){
            let day = [];
            if(j === 2){
                for(let k=1;k<29;k++){
                  day.push(k+'日');
                }
                if(i%4 === 0){
                    day.push(29+'日');
                }
            }
            else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                for(let k=1;k<32;k++){
                    day.push(k+'日');
                }
            }
            else{
                for(let k=1;k<31;k++){
                    day.push(k+'日');
                }
            }
            let _month = {};
            _month[j+'月'] = day;
            month.push(_month);
        }
      }

        let _date = {};
        _date[i+'年'] = month;
        date.push(_date);
    }

    return date;
  }
  _showDatePicker() {
    var year = ''
    var month = ''
    var day = ''

    var dateStr = this.state.selectedDate
    year = dateStr.substring(0,4)
    month = parseInt(dateStr.substring(5,7))
    day = parseInt(dateStr.substring(8,10))
    Picker.init({
      pickerTitleText:'日期选择',
      pickerCancelBtnText:'取消',
      pickerConfirmBtnText:'确定',
      pickerTextEllipsisLen:6,
      pickerData: this._createDateData(),
      selectedValue:[year+'年',month+'月',day+'日'],
      onPickerConfirm: (pickedValue, pickedIndex) => {
        var year = pickedValue[0].substring(0,pickedValue[0].length-1)
        var month = pickedValue[1].substring(0,pickedValue[1].length-1)
        month = month.padStart(2,'0')
        var day = pickedValue[2].substring(0,pickedValue[2].length-1)
        day = day.padStart(2,'0')
        let str = year+'-'+month+'-'+day
        this.props.setDateOrTime(str)
        this.setState({selectedDate:str})
      },
    });
    Picker.show();
  }

  render() {
    return (
        <View >
          <TouchableOpacity  onPress={()=>{this.state.modle=='Time'?this._showTimePicker():this.state.modle=='Date'?this._showDatePicker():''}}>
            <Image style={{width:30,height:30}}  source={require('../../assets/image3/clander.png')}></Image>
          </TouchableOpacity>
        </View>
        
    );
  }
}
