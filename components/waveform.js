import React from 'react';
import {View } from 'react-native';
import Canvas from 'react-native-canvas';

export default function WaveForm() {
  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ width: '100%', height: '25%', marginTop:25, backgroundColor: 'pink' }} />
    </View>
  );
}