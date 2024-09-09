import { useState } from "react";
import { NumberInput, Slider } from "@mantine/core";
import classes from "./SliderInput.module.css";

export default function SliderInput(props: any) {
  const [value, setValue] = useState<number | string>(props.value);

  function updateVolume(newValue: number) {
    setValue(newValue);
    // props.updateVolume({ ...props, volume: newValue / 100 });
  }
  
  return (
    <div className={classes.wrapper}>
      <NumberInput
        value={value}
        onChange={setValue}
        label={props.label}
        placeholder="2200 is an average value"
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
        onChange={setValue}
        size={2}
        className={classes.slider}
        classNames={classes}
      />
    </div>
  );
}
