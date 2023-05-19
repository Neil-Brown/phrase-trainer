import * as React from 'react';
import {  FlatList, Text, View, SafeAreaView, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';



export default function AudioPlayer() {
  const [sound, setSound] = React.useState();
  const [maxValue, setMaxValue] = React.useState()
  const [slidePos, setSlidePos] = React.useState(0)
  const [time, setTime] = React.useState("00:00")
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [buttontext, setButtontext] = React.useState("Play")

  const [waveForm, setWaveForm] = React.useState([])
  let waveData = []
  let count = 0

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

async function parseData(data){
  let wd =[]
  let thisDataCount = 0
  if(count >= 500){
    return
  }
  for(let x =0;x < data.length;x++){
    if(data[x] >=0.1 ){
      let newValue = parseInt(`${data[x].toFixed(1)}`.split(".")[1])
      console.log( newValue)
      console.log(data[x])
      wd.push({id:count, value:newValue})
      count++
      console.log("count " + count)
    }
    setWaveForm(oldArray => [...oldArray, ...wd])
  }
}

  async function loadSound() {
    const { sound } = await Audio.Sound.createAsync( require('../assets/Hello.mp3'))
    sound.setOnPlaybackStatusUpdate(sample)
    sound.setOnAudioSampleReceived(async (s)=>{
      //console.log(s.channels[0].frames)
      await parseData(s.channels[0].frames)
    })
    setSound(sound);
    console.log('Loaded Sound');
    console.log(Object.keys(sound))
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
      <View style={styles.waveformContainer}>
        <FlatList
        contentContainerStyle={{justifyContent: 'center', alignItems:"center", backgroundColor:"green"}}
          horizontal
          data={waveForm}
          renderItem={({item}) => <Item title={item.value} />}
          keyExtractor={item => item.id}
        />
      </View>

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
        />
        <Text style={styles.timeText}>{time}</Text>
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
    backgroundColor: "red"
  },
  controls:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    margin:10
  },
  item:{
    backgroundColor:"blue",
    margin:1,
    width:5,

  }
});
