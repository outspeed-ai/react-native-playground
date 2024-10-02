import React from "react";

import { mediaDevices, MediaStream } from "react-native-webrtc";

export function useSetupConnection() {
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  const handleOnMount = React.useCallback(async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
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
  }, []);

  return {
    stream,
    handleOnMount,
  };
}
