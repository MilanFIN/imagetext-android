import React, {useEffect, useState} from 'react';


import Camera from './Camera';

import {ActivityIndicator,  BackHandler,  Buon, Image, ImageBackground, ImageProps, ImageSourcePropType, ImageURISource, SafeAreaView,  TextInput, View, Dimensions} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Text } from 'react-native-paper';


import ImageResizer from 'react-native-image-resizer';

const PYTORCH_SERVER_HOST="http://asdf.dy.fi:5000"


const App = () => {

  const [img, setImg] = useState<ImageURISource | null>(null);
  const [view, setView] = useState("camera")
  const [text, setText] = useState("");



  useEffect(() => {
    const backAction = () => {
      
      console.log(view)
      if (view != "camera") {
        goBack()
        return true;

      }
      else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [view]);



  
  function onPicture(uri: ImageURISource) {
    setView("confirm")
    setImg(uri);
  }
  


  async function sendImage() {
    setView("loading")
    let formData = new FormData();

    if (img != null) {
      console.log(Object.keys(img))
      let width = img.width;
      let height = img.height;

      let newHeight = height;
      let newWidth = width;

      if (height >= width && height > 1000) {
        let aspect = width/height;
        newHeight = 1000;
        newWidth = parseInt(1000*aspect);
      }
      else if (height < width && width > 1000) {
        let aspect = height/width;
        newWidth = 1000;
        newHeight = parseInt(1000*aspect);
      }


      ImageResizer.createResizedImage(img.uri, newWidth, newHeight, "JPEG", 100, 0, undefined)
      .then(response => {
        // response.uri is the URI of the new image that can now be displayed, uploaded...
        // response.path is the path of the new image
        // response.name is the name of the new image with the extension
        // response.size is the size of the new image
        let uri = response.uri;

        var photo = {
          uri: uri,//img.uri,
          name: 'photo',
          type: "image/jpeg"
        };
        formData.append('photo',  photo)
  
      
       
      
      
        const controller = new AbortController()
      
        // 5 second timeout:
        const timeoutId = setTimeout(() => controller.abort(), 20000)
      
        fetch(PYTORCH_SERVER_HOST, 
          { signal: controller.signal ,method: "POST", body: formData }) //, body: formData
          .then(async res => {
            let data = await res.json()
            setText(data)
            setView("result")
          }).catch (err => {
            setText(err.toString())
            setView("result")
          })

      })
      .catch(err => {
        console.log("ERR")
        console.log(err)
        // Oops, something went wrong. Check that the filename is correct and
        // inspect err to get more details.
      });
  
    }
          

/*
    fetch('http://10.0.2.2:5000',
       {method: "POST", body: formData}
    ).then(async res => {
      let data = await res.json()
      let lines: string = "";
      data.forEach((line: string) => {
        lines += line + "\n"
      })
      setText(lines)
      setView("result")
    }).catch (err => {
      setText(err.toString())
      setView("result")

    })
*/
    


  }
  function goBack() {
    if (view == "result") {
      setView("confirm")
    }
    else if (view == "confirm") {
      setImg(null)
      setView("camera")
    }
    else if (view == "info") {
      setImg(null)
      setView("camera")
    }
  }
  function resultChange(event: string) {
    setText(event)
  }
  function goToInfo() {
    setView("info")
  }


  if (img == null && view == "camera") { 
    return (

      <Camera onPicture={onPicture} onInfo={goToInfo}></Camera>     

    )
  }
  //// justifyContent: 'flex-end', marginBottom: "10%"}}>
  /*
                <View style={{width: "25%", height: "10%",     alignSelf: 'center', }}>
               <Button title="back" onPress={onBackToCamera}></Button>

            </View>

  */
 //                <Button title="send" onPress={sendImage} color="#0000DD"></Button>
//               <Button title="back" onPress={goBack} color="#0000DD"></Button>

  else if (img != null && view == "confirm") { //
    return (
      <View style={{flex: 1}}>

           <ImageBackground source={img} style={{flex: 1}}>

            <View style={{flex: 1, flexDirection:"row", justifyContent: 'center', marginBottom: "5%"}}>

              <View style={{width: "15%", height: "15%",     alignSelf: "flex-end", marginRight: "5%" }}>

               <Button
                  mode="contained"
                  color="#0000DD"

                  style={{borderRadius: 100}}
                  onPress={goBack}
                  
                >
                  <Icon name="cancel" size={30} color="#fff" />
                </Button>
              </View>
              <View style={{width: "15%", height: "15%",     alignSelf: 'flex-end', marginRight: "5%"}}>
                <Button
                  mode="contained"
                  color="#0000DD"

                  style={{borderRadius: 100}}
                  onPress={sendImage}
                  
                >
                  <Icon name="check-bold" size={30} color="#fff" />
                </Button>



              </View>





            </View>


           </ImageBackground>
         
    </View>
    );
  }
  
  else if (view == "loading") {
    return (
      <View         
        style={{
          flex:1,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
          backgroundColor: "#000000"
        }}
      >
      <Text>Loading</Text>
      <ActivityIndicator size="large" color="00dd00"/>
      
      </View>

    )
  }
  else if (view == "result") {
    return (

      <View         
        style={{
          flex: 1,
          backgroundColor: "#000000",
          flexDirection:"column",
        }}
      >
        <View
          style={{ flex: 1, height:"100%", backgroundColor: "#111",
            borderColor: '#fff',  borderRadius: 5, borderWidth: 1, width: "80%", justifyContent: "center",alignSelf:"center",
            marginTop:"5%"
          }}>

        <TextInput value={text} multiline={true} 
            style={{ flex: 1, padding:5, color:"#FFFFFF",  width:'100%',backgroundColor:"#111", }}
            onChangeText={resultChange}
        />

        </View>


        <View style={{ height: "15%", justifyContent: "flex-end", marginBottom: "5%"}}>
          <View style={{alignSelf: 'center',width: "15%", }}>
                <Button
                  mode="contained"
                  color="#0000DD"

                  style={{borderRadius: 100}}
                  onPress={goBack}
                  
                >
                  <Icon name="chevron-left" size={30} color="#fff" />
                </Button>

          </View>

            
        </View>

  
          
      </View>
    )
  
  }
  else if (view == "info") { return (

    <View         
    style={{
      flex: 1,
      backgroundColor: "#000000",
      flexDirection:"column",
    }}
  >
    <View
      style={{ flex: 1, height:"100%", backgroundColor: "#111",
        borderColor: '#fff',  borderRadius: 5, borderWidth: 1, width: "80%", justifyContent: "center",alignSelf:"center",
        marginTop:"5%"
      }}>

    <Text 
        style={{ flex: 1, padding:5, color:"#FFFFFF",  width:'100%',backgroundColor:"#111", }}>
      {`
      Here is gonna be ~
      some info in the future ~
      Now with line changes
      `}  
    </Text>

    </View>


    <View style={{ height: "15%", justifyContent: "flex-end", marginBottom: "5%"}}>
      <View style={{alignSelf: 'center',width: "15%", }}>
      <Button
        mode="contained"
        color="#0000DD"

        style={{borderRadius: 100}}
        onPress={goBack}
        
      >
        <Icon name="chevron-left" size={30} color="#fff" />
      </Button>


      </View>

        
    </View>


      
  </View>
  )
  }
  else {
    return (
    <View
      style = {{flex: 1 ,backgroundColor: "#000000" ,       flexDirection:"column",   }}
      
    >

    </View>
    )
  }
  
}
export default App;