import * as React from 'react';
import { Alert, FlatList, Text, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Button } from 'react-native';
import { Audio } from 'expo-av';
import {FileSystem, Asset, Constants } from 'expo';
import Slider from '@react-native-community/slider'
import Canvas from 'react-native-canvas';




export default function AudioPlayer() {
  const [sound, setSound] = React.useState();
  const [maxValue, setMaxValue] = React.useState()
  const [slidePos, setSlidePos] = React.useState(0)
  const [time, setTime] = React.useState("00:00")
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [buttontext, setButtontext] = React.useState("Play")
  const [canvasWidth, setCanvasWidth] = React.useState(2000)
  const [loopStart, setLoopStart] = React.useState("0")
  const [loopEnd, setLoopEnd] = React.useState(`${maxValue}`)

  const [waveForm, setWaveForm] = React.useState([])
  const canvas = React.useRef(null);
  let ctx = null

  let xPos = 0
   let scroll = null
  handleCanvas = (canvas) => {
  if(canvas !== null){
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
  }
  }

  React.useEffect(() => {

  }, [canvasWidth])


  function drawLine(height){
    xPos+=1
    if(xPos > canvasWidth){
    setCanvasWidth(canvasWidth+2)
    scroll.scrollTo({x: xPos, y: 0, animated: true})
    }

//   handleCanvas.current.focus(xPos, 100)
    //scroll.scrollToEnd({animated: true})
    ctx.moveTo(xPos, 0);
    ctx.lineTo(xPos, height*500);
    ctx.stroke();

  }

  function sample(s){
    setMaxValue(s.durationMillis)
    setSlidePos(s.positionMillis)
    setTime(convertTime(s.positionMillis))
  }

  function skip(pos){
    console.log(pos)
    // setSlidePos(pos)
    sound.setPositionAsync(pos)
  }

  function convertTime(milliseconds) {
    let seconds = milliseconds / 1000;
    const minutes = Math.floor(seconds / 60);
    seconds = parseInt(seconds % 60);
    const formattedTime = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    return formattedTime + ":" + formattedSeconds;
}

function parseData(data){
let newData = data.filter(value => value >= 0).map(value => value.toFixed(1))
for(const val of newData){
    drawLine(val)
}
setWaveForm((waveForm)=>[...waveForm, newData])
//    setWaveForm(data.filter(value => value >= 0).map(value => value.toFixed(1)))
}

  async function loadSound() {
    const { sound } = await Audio.Sound.createAsync( require('../assets/Hello.mp3'))
    sound.setOnPlaybackStatusUpdate(sample)
    sound.setOnAudioSampleReceived(async (s)=>{
      //console.log(s.channels[0].frames)
      parseData(s.channels[0].frames)
    })
    setSound(sound);
    xPos = 0
    console.log('Loaded Sound');
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  React.useEffect(() => {
    if(isPlaying){
      setButtontext("Stop")
    } else{
      setButtontext("Play")
    }
  }, [isPlaying]);

  React.useEffect(() => {
    loadSound()

  }, []);

  const Item = ({title}) => (
    <View style={[styles.item, {height:title*40}]}>
    </View>
  );


  return (
    <SafeAreaView>
        <Canvas style={[styles.canvas, {width:canvasWidth}]} ref={handleCanvas} />
        <View style={styles.controls}>
            <Button style={styles.button} title={buttontext} onPress={async()=>{
              if(isPlaying){
                sound.pauseAsync()
                setIsPlaying(false)
              } else{
                await sound.playAsync();
                setIsPlaying(true)
              }
            }}
            />
            <Slider
              style={{width: 200, height: 40}}
              minimumValue={0}
              maximumValue={maxValue}
              minimumTrackTintColor="red"
              maximumTrackTintColor="#000000"
              value ={slidePos}
              onSlidingComplete={skip}
              lowerLimit={parseFloat(loopStart)}
              minimumTrackTintColor="blue"
            />
            <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Start</Text>
        <Text style={styles.label}>End</Text>
      </View>
      <View style={styles.controls}>
       <TextInput
        style={styles.input}
        onChangeText={setLoopStart}
        value={loopStart}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        onChangeText={setLoopEnd}
        value={loopEnd}
        keyboardType="numeric"
      />
      </View>
    </SafeAreaView>

  );
}


const styles = StyleSheet.create({
  container:{
  },
  waveformContainer:{
    backgroundColor:"yellow",
    maxHeight:"90%",



  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding:10,
    borderRadius:10,
    margin:10
  },
  controls:{
  backgroundColor:"red",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    margin:0
  },
  item:{
    backgroundColor:"blue",
    margin:1,
    width:5,
  },
  canvas:{
    height:"40%",
  backgroundColor:"yellow"
  },

  input:{
    borderWidth:1,
    borderColor:"black",
    height:40,
    width:150,
    padding:10,
    margin:10
  },
  labelContainer:{
    flexDirection:"row",
    justifyContent:"center"
  },
  label:{
    fontSize:50,
    color:"green"
  }
  }
  )

