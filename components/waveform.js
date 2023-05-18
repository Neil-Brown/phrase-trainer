import React, {useState} from 'react';
import Sound from 'react-native-sound';

const WaveForm = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [waveform, setWaveform] = useState(null);

  const handleAudioFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const getWaveform = async () => {
    const sound = new Sound(audioFile, {
      type: 'mp3',
    });

    const waveformData = await sound.getWaveform();
    setWaveform(waveformData);
  };

  return (
    <div>
      <input type="file" onChange={handleAudioFileChange} />
      <button onClick={getWaveform}>Get Waveform</button>
      {waveform && (
        <Waveform waveformData={waveform} />
      )}
    </div>
  );
};

export default WaveForm;
