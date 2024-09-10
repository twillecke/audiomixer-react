import useWebSocket, { ReadyState } from "react-use-websocket";
import SliderInput from "./Components/SliderInput";
import { useEffect, useState } from "react";


export default function App2() {
  const [volume, setVolume] = useState(0);
  // const [volumeTest, setVolumeTest] = useState(0);
  const WS_URL = "ws://127.0.0.1:8080"
  // @ts-ignore
  const { sendJsonMessage, sendMessage, lastJsonMessage, lastMessage, readyState } = useWebSocket(
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
      const data = lastJsonMessage?.data;
      console.log("Incoming data", data);
    }
  }, [readyState])
  // log the incoming message
  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.data) {
      console.log(`Got a new message:`, lastJsonMessage.data);
      setVolume(lastJsonMessage.data.volume * 100);
    }
  }, [lastJsonMessage])
  // on volume change send a message to the websocket to update the volume
  function handleVolumeChange(newValue: number) {
    setVolume(newValue);
    sendJsonMessage({
      type: "SET_VOLUME",
      data: {
        trackName: "UIStop",
        volume: newValue / 100
      }
    })
  }
  return (
    <div>
      <h1>App2</h1>
      <SliderInput value={volume} handleVolumeChange={handleVolumeChange} />
    </div>
  );
}