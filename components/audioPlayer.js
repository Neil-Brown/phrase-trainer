import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

export default function AudioPlayer() {
  const [sound, setSound] = React.useState();
  const [maxValue, setMaxValue] = React.useState()
  const [slidePos, setSlidePos] = React.useState(0)
  const [time, setTime] = React.useState("00:00")
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [buttontext, setButtontext] = React.useState("Play")



  function sample(s){
    console.log(s)
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

  async function loadSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('../assets/Hello.mp3')
    );
    sound.setOnPlaybackStatusUpdate(sample)
    setSound(sound);
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


  return (
    <View style={styles.container}>
      <Button style={styles.button} title={buttontext} onPress={async()=>{
        if(isPlaying){
          sound.pauseAsync()
          setIsPlaying(false)
        } else{
          await sound.playAsync();
          setIsPlaying(true)
        }
      }
    } />
      <Slider
        style={{width: 200, height: 40}}
        minimumValue={0}
        maximumValue={maxValue}
        minimumTrackTintColor="red"
        maximumTrackTintColor="#000000"
        value ={slidePos}
        onSlidingComplete={skip}
      />
      <Text>{time}</Text>
    </View>

  );
}


const styles = StyleSheet.create({
  button: {
    backgroundColor: "red"
  }
});
