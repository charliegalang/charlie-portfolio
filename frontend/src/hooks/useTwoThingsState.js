import { useState } from 'react';

export const useTwoThingsState = () => {
  const [twoThingsTitle, setTwoThingsTitle] = useState({ light: "Two Things", dark: "Two Things" });
  const [twoThingsSubtitle, setTwoThingsSubtitle] = useState({ light: "", dark: "" });
  const [twoThingsBgColor, setTwoThingsBgColor] = useState({ light: "transparent", dark: "transparent" });
  const [twoThingsLineColor, setTwoThingsLineColor] = useState({ light: "#EAB308", dark: "#EAB308" });

  return {
    twoThingsTitle, setTwoThingsTitle,
    twoThingsSubtitle, setTwoThingsSubtitle,
    twoThingsBgColor, setTwoThingsBgColor,
    twoThingsLineColor, setTwoThingsLineColor
  };
};
