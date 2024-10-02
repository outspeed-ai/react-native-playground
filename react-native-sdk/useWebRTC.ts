import React from "react";
import { RealtimeConnectionNegotiator } from "./negotiator";
import { RTCPeerConnection } from "react-native-webrtc";
import { MediaStream } from "react-native-webrtc";

export function useWebRTC() {
  const [connection, setConnection] = React.useState<RTCPeerConnection>();
  const [remoteTrack, setRemoteTrack] = React.useState<MediaStream>();

  const _handleOnTrack = React.useCallback((event: any) => {
    console.log("Track event", event);
    if (event.track) {
      console.log("Event", event.track.kind);
      setRemoteTrack(new MediaStream([event.track as any]));
    }
  }, []);

  const connect = React.useCallback(async (stream: MediaStream) => {
    const peerConnection = new RTCPeerConnection();
    stream.getTracks().forEach((track) => {
      console.log("Track", track.kind);
      // if (track.kind.includes("audio")) {
      // console.log("add audio track");
      peerConnection.addTrack(track, stream);
      // }
    });

    peerConnection.addEventListener("track", _handleOnTrack);

    const negotiator = new RealtimeConnectionNegotiator(peerConnection, {
      logger: console,
      functionURL: "https://79zhb27t-8080.asse.devtunnels.ms",
      codec: {
        audio: "PCMU/8000",
      },
    });
    console.log("Starting..");
    const response = await negotiator.negotiateAndUpdatePeerConnection();
    console.log("Ending...", response);
    if (response.ok) {
      setConnection(peerConnection);
    } else {
      console.log("Error", response);
    }
  }, []);

  return {
    connection,
    remoteTrack,
    connect,
  };
}
