import useWebSocket, { ReadyState } from "react-use-websocket";
import SliderInput from "./Components/SliderInput";
import { useEffect, useState } from "react";

type VolumeSettings = {
  bootedVolumeSettings: Array<VolumeSetting>;
}

type VolumeSetting = {
  key: string;
  volume: number;
  fader: string;
}

export default function App2() {
  const [volume, setVolume] = useState<VolumeSettings>({ bootedVolumeSettings: [] });
  const WS_URL = "ws://127.0.0.1:8080"
  const { sendJsonMessage, sendMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )
  // on successful connection send a greeting mesage
  useEffect(() => {
    console.log("Connection state changed")
    if (readyState === ReadyState.OPEN) {
      sendMessage(
        "Hello from App2"
      )
    }
  }, [readyState])
  // log the incoming message
  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.data) {
      console.log(`Got a new message:`, lastJsonMessage.data);
      setVolume(lastJsonMessage.data);
    }
  }, [lastJsonMessage])
  // on volume change send a message to the websocket to update the volume
  function handleVolumeChange(key: string, newVolume: number) {
    setVolume((prevState) => {
      const newVolumeSettings = prevState.bootedVolumeSettings.map((item: VolumeSetting) => {
        if (item.key === key) {
          return {
            key: key,
            volume: newVolume / 100,
            fader: "UI"
          }
        }
        return item;
      })
      console.log("New Volume Settings", newVolumeSettings);

      sendJsonMessage({
        type: "SET_GLOBAL_VOLUME_STATE",
        data: {
          volumeSettings: newVolumeSettings
        }
      })
      return {
        bootedVolumeSettings: newVolumeSettings
      }
    });
  }
  return (
    <div>
      <h1>App2</h1>
      {volume.bootedVolumeSettings.length > 0 &&
        volume.bootedVolumeSettings.map((item: VolumeSetting, index: number) => (
          <SliderInput key={index} label={item.key} value={+(item.volume * 100).toFixed(0)} handleVolumeChange={handleVolumeChange} />
        ))
      }
    </div>
  );
}