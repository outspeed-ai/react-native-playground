import React from "react";
import { RealtimeConnectionNegotiator } from "./negotiator";
import { RTCPeerConnection } from "react-native-webrtc";
import { MediaStream } from "react-native-webrtc";
import InCallManager from "react-native-incall-manager";

export function useWebRTC() {
  const [connection, setConnection] = React.useState<RTCPeerConnection>();
  const [status, setStatus] = React.useState<
    "new" | "connecting" | "connected" | "failed"
  >("new");
  const [dataChannel, setDataChannel] = React.useState<any>();
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
    peerConnection.addEventListener("connectionstatechange", (state) =>
      console.log("Peer connection callback", state)
    );
    console.log("Peer connection state", peerConnection.connectionState);
    stream.getTracks().forEach((track) => {
      console.log("Track", track.kind);
      // if (track.kind.includes("audio")) {
      console.log("add audio track");
      peerConnection.addTrack(track, stream);
      // }
    });

    peerConnection.addEventListener("track", _handleOnTrack);
    const dc = peerConnection.createDataChannel("chat", { ordered: true });

    setDataChannel(dc);
    setStatus("connecting");
    const negotiator = new RealtimeConnectionNegotiator(peerConnection, {
      logger: console,
      // functionURL: "https://79zhb27t-8080.asse.devtunnels.ms",
      functionURL: "http://192.168.11.12:8080",
      codec: {
        audio: "PCMU/8000",
      },
    });
    console.log("Starting..");
    const response = await negotiator.negotiateAndUpdatePeerConnection();
    console.log("Ending...", response);
    console.log("Peer connection state", peerConnection.connectionState);
    if (response.ok) {
      setStatus("connected");
      InCallManager.setSpeakerphoneOn(true);
      setConnection(peerConnection);
    } else {
      setStatus("connected");
      console.log("Error", response);
    }
  }, []);

  return {
    connection,
    remoteTrack,
    connect,
    status,
    dataChannel,
  };
}
