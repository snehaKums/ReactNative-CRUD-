import React, { Component } from 'react';
import {View, Image, Text, TextInput, TouchableOpacity, Alert, YellowBox,
  Button,PermissionsAndroid,Platform} from 'react-native';
import ListView from 'deprecated-react-native-listview'
import ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';

var Realm = require('realm');
 
let realm ;
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import styles from './styles';

class Register extends Component{
 
  static navigationOptions =
  {
     title: 'Register',
  };
 
  GoToSecondActivity = () =>
  {
     this.props.navigation.navigate('Second');
     
  }
 
  constructor(){
 
    super();
 
    this.state = {
      Employee_Name : '',
      PhoneNo : '',
      email : '',
      photo:{},
      currentLongitude: 'unknown',//Initial Longitude
      currentLatitude: 'unknown',
 
  }
 
    realm = new Realm({
      schema: [{name: 'Employee_Info', 
      properties: 
      {
        employee_id: {type: 'int',   default: 0},
        employee_name: 'string', 
        PhoneNo: 'string',
        email:'string',
        currentLongitude: 'string',//Initial Longitude
        currentLatitude: 'string',
        photo:'string',
      }}]
    });
 
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
      'Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'
     ]);
 
  }
  componentDidMount = () => {
    var that =this;
    if(Platform.OS === 'ios'){
      this.callLocation(that);
    }else{
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
              'title': 'Location Access Required',
              'message': 'This App needs to Access your location'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            that.callLocation(that);
          } else {
            alert("Permission Denied");
          }
        } catch (err) {
          alert("err",err);
          console.warn(err)
        }
      }
      requestLocationPermission();
    }    
   }
   callLocation(that){
      Geolocation.getCurrentPosition(
         (position) => {
            const currentLongitude = JSON.stringify(position.coords.longitude);
            const currentLatitude = JSON.stringify(position.coords.latitude);
            that.setState({ currentLongitude:currentLongitude });
            that.setState({ currentLatitude:currentLatitude });
         },
      );
      that.watchID = Geolocation.watchPosition((position) => {
          console.log(position);
          const currentLongitude = JSON.stringify(position.coords.longitude);
          const currentLatitude = JSON.stringify(position.coords.latitude);
         that.setState({ currentLongitude:currentLongitude });
         that.setState({ currentLatitude:currentLatitude });
      });
   }
   componentWillUnmount = () => {
      Geolocation.clearWatch(this.watchID);
   }

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  validatePhone = phone => {
    var ph = /^[0]?[789]\d{9}$/
    return ph.test(phone)
  }
  chooseFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // let source = { uri: 'data:image/jpeg;base64,' + response.data }
        let source = response;
        this.setState({
          photo: source,
        });
      }
    });
  };

  add_Employee=()=>{
    if (!this.validateEmail(this.state.email)) {
      alert('Please enter Email correctly')
      }
    if (!this.validatePhone(this.state.PhoneNo)) {
        alert('Please enter Phone No correctly')
        }
  else{
  realm.write(() => {
 
    var ID = realm.objects('Employee_Info').length + 1;

     realm.create('Employee_Info', {
      employee_id: ID, 
      employee_name: this.state.Employee_Name, 
       PhoneNo: this.state.PhoneNo, 
       email : this.state.email,
       //photo : this.state.photo,
       currentLongitude: this.state.currentLongitude,
        currentLatitude: this.state.currentLatitude
      });
      
  });

  Alert.alert("Employee Details Added Successfully.")
  }
 
  }

  render() {
    return (
    
        <View style={styles.MainContainer}>
          <View style={styles.container}>
          <Image
            source={{
              uri: 'data:image/jpeg;base64,' + this.state.photo.data,
            }}
            style={{ width: 100, height: 100 ,marginBottom:10}}
          />
          {/* <Image
            source={{ uri: this.state.photo.uri }}
            style={{ width: 250, height: 250 }}
          /> */}
          <Button title="Choose File" onPress={this.chooseFile.bind(this)} />
        </View>
          <TextInput 
                placeholder="Enter Employee Name"
                style = { styles.TextInputStyle } 
                underlineColorAndroid = "transparent" 
                onChangeText = { ( text ) => { this.setState({ Employee_Name: text })} } 
          />
          <TextInput
            style = { styles.TextInputStyle } 
            underlineColorAndroid = "transparent" 
            onChangeText={(email) => {
            this.setState({email})
            }} 
            placeholder="Enter Email address"
            value={this.state.email}
            />
      
          <TextInput  
                placeholder="Enter Phone no"
                style = { styles.TextInputStyle } 
                underlineColorAndroid = "transparent" 
               // onChangeText = { ( text ) => { this.setState({ PhoneNo: text })} } 
                onChangeText={(PhoneNo) => {
                  this.setState({PhoneNo})
                  }} 
                value={this.state.PhoneNo}
              />

          <Text style={{justifyContent:'center',alignItems: 'center',marginTop:16}}>
            Longitude: {this.state.currentLongitude}
          </Text>
          <Text style={{justifyContent:'center',alignItems: 'center',marginTop:16}}>
            Latitude: {this.state.currentLatitude}
          </Text>
          <TouchableOpacity onPress={this.add_Employee} activeOpacity={0.7} style={styles.button} >
 
            <Text style={styles.TextStyle}> ADD EMPLOYEE DETAILS </Text>
 
          </TouchableOpacity>
 
          <TouchableOpacity onPress={this.GoToSecondActivity} activeOpacity={0.7} style={styles.button} >
 
            <Text style={styles.TextStyle}> SHOW ALL EMPLOYEES </Text>
 
          </TouchableOpacity>
             
        </View>
              
    );
  }
}
 
class EmployeeList extends Component
{
  static navigationOptions =
  {
     title: 'Employees List',
  };
 
  constructor() {
 
    super();
  
    YellowBox.ignoreWarnings([
     'Warning: componentWillMount is deprecated',
     'Warning: componentWillReceiveProps is deprecated',
     'Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'
    ]);
 
   var mydata = realm.objects('Employee_Info');
 
   let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
 
    this.state = {
      dataSource: ds.cloneWithRows(mydata),
    };
  
  }
 
  GoToEditActivity (employee_id, employee_name, phoneNo,email,currentLatitude,currentLongitude) {
 
    this.props.navigation.navigate('Third', { 
 
      ID : employee_id,
      NAME : employee_name,
      PHONENO : phoneNo,
      EMAIL :email,
      //PHOTO : photo,
      LAT:currentLatitude,
      LONG:currentLongitude
 
    });
 
     
    }
 
  ListViewItemSeparator = () => {
    return (
      <View
        style={{
          height: .5,
          width: "100%",
          backgroundColor: "#000",
        }}
      />
    );
  }
 
  render()
  {
 
     return(
        <View style = { styles.MainContainer }>
 
            <ListView
            
            dataSource={this.state.dataSource}
 
            renderSeparator= {this.ListViewItemSeparator}
 
            renderRow={(rowData) => <View style={{flex:1, flexDirection: 'column'}} >
 
                      <TouchableOpacity onPress={this.GoToEditActivity.bind(this, rowData.employee_id, rowData.employee_name, rowData.PhoneNo,
                       rowData.email,rowData.currentLatitude,rowData.currentLongitude)} >
                                  
                      <Text style={styles.textViewContainer} >{rowData.employee_name}</Text>
                                          
                      </TouchableOpacity>
              
                    </View> }
 
            />
 
        </View>
     );
  }
}
 
class Detail extends Component{
 
  static navigationOptions =
  {
     title: 'Details',
  };
 
  constructor(){
 
    super();
 
    this.state = {
 
      Employee_Id : '',
      Employee_Name : '',
      PhoneNo : '',
      email : '',
      currentLongitude : '',
      currentLatitude : '',
      //photo : {}
 
  }
 
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
      'Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'
     ]);
 
  }
 
  componentDidMount(){
  
    this.setState({ 
      
      Employee_Id : this.props.navigation.state.params.ID,
      Employee_Name: this.props.navigation.state.params.NAME,
      PhoneNo: this.props.navigation.state.params.PHONENO,
      email : this.props.navigation.state.params.EMAIL,
      latitude:this.props.navigation.state.params.LAT,
      longitude:this.props.navigation.state.params.LONG,
      //photo: this.props.navigation.state.params.PHOTO
    })
 
   }
 

 
  Delete_Employee=()=>{
 
    realm.write(() => {
 
      var ID = this.state.Employee_Id - 1;
 
     realm.delete(realm.objects('Employee_Info')[ID]);
 
      });
 
    Alert.alert("Record Deleted Successfully.")
 
    this.props.navigation.navigate('First');
 
  }
 
  render() {
 
    return (
    
        <View style={styles.MainContainer}>
          {/* <Image
            source={{ uri: this.state.photo }}
            style={{ width: 300, height: 300 }}
          /> */}
          <Text>{'Name: ' + this.state.Employee_Name}</Text>
          <Text>{'Email: ' + this.state.email}</Text>
          <Text>{'Phone No: ' + this.state.PhoneNo}</Text>
          <Text>{'Latitude: ' + this.state.latitude}</Text>
          <Text>{'Longitude: ' + this.state.longitude}</Text>
          <TouchableOpacity  activeOpacity={0.7} style={styles.button} onPress={this.Delete_Employee} >
 
            <Text style={styles.TextStyle}> CLICK HERE TO DELETE CURRENT RECORD </Text>
 
          </TouchableOpacity>
             
        </View>
              
    );
  }
}
 
const Main = createStackNavigator(
  {
   First: { screen: Register },
   
   Second: { screen: EmployeeList },
 
   Third : { screen: Detail}
  });
export default createAppContainer(Main)

