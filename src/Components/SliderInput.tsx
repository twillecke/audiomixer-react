import { useEffect, useState } from "react";
import { NumberInput, Slider } from "@mantine/core";
import classes from "./SliderInput.module.css";

export default function SliderInput(props: any) {
  const [value, setValue] = useState<number | string>(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  function updateVolume(newValue: string | number) {
    if (typeof newValue === "string") {
      newValue = parseInt(newValue);
    }
    setValue(newValue);
    props.handleVolumeChange(newValue);
  }
  
  return (
    <div className={classes.wrapper}>
      <NumberInput
        value={value}
        onChange={updateVolume}
        label={props.label}
        placeholder="Values from 0 to 100"
        step={1}
        min={0}
        max={100}
        hideControls
        classNames={{ input: classes.input, label: classes.label }}
      />
      <Slider
        max={100}
        step={1}
        min={0}
        label={null}
        value={typeof value === "string" ? 0 : value}
        onChange={updateVolume}
        size={2}
        className={classes.slider}
        classNames={classes}
      />
    </div>
  );
}
