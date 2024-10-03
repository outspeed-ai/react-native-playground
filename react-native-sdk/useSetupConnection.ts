import React from "react";

import { mediaDevices, MediaStream } from "react-native-webrtc";

export function useSetupConnection() {
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  const handleOnMount = React.useCallback(
    async (hasAudio: boolean, hasVideo: boolean) => {
      try {
        const devices = await mediaDevices.enumerateDevices();

        console.log("Devices", devices);

        const stream = await mediaDevices.getUserMedia({
          video: hasVideo,
          audio: hasAudio,
        });

        if (stream) {
          stream.getTracks().map((track) => {
            console.log("Tracks", track);
            if (!track.enabled) {
              track.enabled = true;
            }
          });
          setStream(stream);
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  return {
    stream,
    handleOnMount,
  };
}
