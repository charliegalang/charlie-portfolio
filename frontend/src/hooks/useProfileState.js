import { useState } from 'react';

export const useProfileState = (parseMultiMode) => {
  const [profileUrl, setProfileUrl] = useState("");
  const [profileId, setProfileId] = useState("");
  const [profileBgColor, setProfileBgColor] = useState({ light: "#EAB308", dark: "#EAB308" });
  const [bgUrl, setBgUrl] = useState("");
  const [bgId, setBgId] = useState("");
  const [bgUrlMobile, setBgUrlMobile] = useState("");
  const [bgIdMobile, setBgIdMobile] = useState("");
  const [bgFit, setBgFit] = useState({ light: "cover", dark: "cover" });

  return {
    profileUrl, setProfileUrl,
    profileId, setProfileId,
    profileBgColor, setProfileBgColor,
    bgUrl, setBgUrl,
    bgId, setBgId,
    bgUrlMobile, setBgUrlMobile,
    bgIdMobile, setBgIdMobile,
    bgFit, setBgFit
  };
};
