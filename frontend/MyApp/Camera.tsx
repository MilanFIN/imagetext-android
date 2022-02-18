import React, {PureComponent} from 'react';import {RNCamera} from 'react-native-camera';
import {TouchableOpacity, Alert, StyleSheet, View, Dimensions} from 'react-native';


import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Text } from 'react-native-paper';

export default class Camera extends PureComponent {
  constructor(props) {
    super(props);
      this.state = {
      takingPic: false,
      rotation: 0,
      orientation: "portrait",
      listener: null
    };
    this.mounted = false
    //      android:screenOrientation="portrait" 

  }
  takePicture = async () => {
    if (this.camera && !this.state.takingPic) {

      let options = {
        quality: 0.85,
        fixOrientation: true,
        forceUpOrientation: true,
      };

      this.mounted && this.setState({takingPic: true});

      try {
        const data = await this.camera.takePictureAsync(options);
        this.props.onPicture(data);

         
         //Alert.alert('Success', JSON.stringify(data));
      } catch (err) {
        Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
        return;
      } finally {
        this.mounted && this.setState({takingPic: false});
      }
    }
  };




  render() {
    if (this.state.orientation == "portrait") {
      return (
        <View style={{flex:1}}  >
      <RNCamera 
          ref={ref => {
            this.camera = ref;
          }}
          captureAudio={false}
      style={{flex: 1}}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
      >
        <View style={{flex: 1, flexDirection: 'column'}}>
  
          <View style={{width: "10%", height: "10%",     alignSelf: 'flex-end', marginTop: "5%", marginRight: "10%"}}>
            <Button
                  color="#0000DD"
                  onPress={this.props.onInfo}
                  mode="contained"
                  style={{borderRadius: 10, opacity: 0.3}}
        
            >
            <Icon name="information-variant" size={25} color="#fff" />
  
              </Button>
  
  
          </View>
  
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end', marginBottom: "5%"}}>
  
  
  
          <View style={{   width: "15%", height: "20%",     alignSelf: 'center',  justifyContent: "center"}}>
          <Button
            mode="contained"
            color="#0000DD"
  
            style={{borderRadius: 1000,
                  //minWidth: "10%",
                  //minHeight: "10%"
            }}
            onPress={this.takePicture}
            
          >
            <Icon name="camera" size={30} color="#fff" />
          </Button>
  
  
          </View>
  
  
                        
                
          </View>
  
  
        </View>
  
       
       </RNCamera>
  
  
      </View>
       );
    }
    else {
      return (
        <View style={{flex:1}}  >


<RNCamera 
          ref={ref => {
            this.camera = ref;
          }}
          captureAudio={false}
      style={{flex: 1}}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
      >


<View style={{flex: 1, flexDirection: 'row'}}>
  
  <View style={{width: "10%", height: "15%",  aspectRatio: 1,  alignSelf: "flex-start", marginTop: "5%", marginLeft: "10%"}}>
    <Button
          color="#0000DD"
          onPress={this.props.onInfo}
          mode="contained"
          style={{borderRadius: 10, opacity: 0.3}}

    >
    <Icon name="information-variant" size={25} color="#fff" />

      </Button>


  </View>

  
  
  
  <View style={{ flex:1, flexDirection:"column", width: "10%", height: "15%",     alignSelf: 'center', justifyContent:"flex-end",  marginTop: "0%", marginRight: "5%"}}>
  <View style={{ alignSelf:"flex-end"}}>
  <Button
    mode="contained"
    color="#0000DD"

    style={{borderRadius: 100}}
    onPress={this.takePicture}
    
  >
    <Icon name="camera" size={30} color="#fff" />
  </Button>


  </View>


  </View>  

  </View>

    </RNCamera>

      </View>
      );
    }
   }


   componentDidMount() {
    this.mounted = true

    const dim = Dimensions.get('screen');
    if  (dim.height >= dim.width) {
      this.setState({
        orientation: "portrait"
      })
    }
    else {
      this.setState({
        orientation: "landscape"
      })
    }

    let listener = Dimensions.addEventListener("change", (e) => {

      const dim = Dimensions.get('screen');
      if  (dim.height >= dim.width) {
        this.setState({
          orientation: "portrait"
        })
      }
      else {
        this.setState({
          orientation: "landscape"
        })
      }
    })
    this.setState({listener: listener})


  }

   componentWillUnmount() {
    this.mounted = false   
    this.state.listener.remove()

   }
  }

