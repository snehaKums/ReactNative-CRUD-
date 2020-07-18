import {StyleSheet} from 'react-native'
const styles = StyleSheet.create({
    
    MainContainer :{
    
     flex:1,
     justifyContent: 'center',
     paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
     margin: 10
       
     },
     container: {
      // flex: 1,
      // backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
     TextInputStyle:
       {
         borderWidth: 1,
         borderColor: '#009688',
         width: '100%',
         height: 40,
         borderRadius: 10,
         marginBottom: 10,
         textAlign: 'center',
         marginTop:10
       },
    
     button: {
       
         width: '100%',
         height: 40,
         padding: 10,
         backgroundColor: '#4CAF50',
         borderRadius:7,
         marginTop: 12
       },
        
     TextStyle:{
         color:'#fff',
         textAlign:'center',
       },
    
       textViewContainer: {
    
         textAlignVertical:'center', 
         padding:10,
         fontSize: 20,
         color: '#000',
         
        },
        itemStyle: {borderBottomColor:'blue', padding: 5},
        multiLineText: {color: 'blue', fontSize: 18},
        dangerText: {color:'red'},

      
     });

     export default styles;