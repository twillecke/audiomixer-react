import useWebSocket, { ReadyState } from "react-use-websocket";
import SliderInput from "./Components/SliderInput";
import { useEffect, useState } from "react";
import classes from './App.module.css'
import { Button, Flex } from "@mantine/core";

type VolumeSettings = {
  bootedVolumeSettings: Array<VolumeSetting>;
}

type VolumeSetting = {
  audioKey: string;
  faderVolume: number;
  group: string;
}

export default function App() {
  const [volume, setVolume] = useState<VolumeSettings>({ bootedVolumeSettings: [] });
  const WS_URL = "ws://localhost:8080"
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
        "Client connected"
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
        if (item.audioKey === key) {
          return {
            ...item,
            audioKey: key,
            faderVolume: newVolume / 100,
          }
        }
        return item;
      })
      console.log("New Volume Settings", newVolumeSettings);
      sendJsonMessage({
        type: "SET_VOLUME",
        data: {
          audioKey: key,
          faderVolume: newVolume / 100,
        }
      })
      return {
        bootedVolumeSettings: newVolumeSettings
      }
    });
  }

  function handleStateChange(key: string, newVolume: number) {
    setVolume((prevState) => {
      const newVolumeSettings = prevState.bootedVolumeSettings.map((item: VolumeSetting) => {
        if (item.audioKey === key) {
          return {
            ...item,
            audioKey: key,
            faderVolume: newVolume / 100,
          }
        }
        return item;
      })
      return {
        bootedVolumeSettings: newVolumeSettings
      }
    });
  }

  function handleExportClick() {
    const fileData = JSON.stringify(volume, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "volumeSettings.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className={classes.appBody}>
      <Flex
        justify={"space-between"}
        align={"center"}
        onClick={handleExportClick}
      >
        <h1>Audio Mixer</h1>
        <Button>Export Config</Button>
      </Flex>

      <div className={classes.mixerGrid}>
        {volume.bootedVolumeSettings.length > 0 &&
          volume.bootedVolumeSettings.map((item: VolumeSetting, index: number) => (
            <SliderInput key={index} label={item.audioKey} value={+(item.faderVolume * 100).toFixed(0)} handleVolumeChange={handleVolumeChange} handleStateChange={handleStateChange} />
          ))
        }
      </div>
    </div>
  );
}