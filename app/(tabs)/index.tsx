import { useSetupConnection } from "@/react-native-sdk/useSetupConnection";
import { useWebRTC } from "@/react-native-sdk/useWebRTC";
import React from "react";
import { Text, SafeAreaView, Button } from "react-native";
import { RTCView, registerGlobals } from "react-native-webrtc";

registerGlobals();

export default function HomeScreen() {
  const { stream, handleOnMount } = useSetupConnection();
  const { connect, remoteTrack, dataChannel, status } = useWebRTC();

  const sendMessage = React.useCallback(() => {
    dataChannel.send(JSON.stringify({ type: "message", data: "Hello!" }));
  }, [dataChannel]);

  return (
    <SafeAreaView
      style={{
        display: "flex",
        marginTop: 20,
      }}
    >
      {stream && (
        <RTCView
          streamURL={stream.toURL()}
          mirror={true}
          objectFit={"cover"}
          style={{ width: 400, height: 200 }}
          zOrder={0}
        />
      )}
      {remoteTrack && (
        <RTCView
          style={{ width: 400, height: 200 }}
          streamURL={remoteTrack.toURL()}
          mirror={true}
          objectFit={"cover"}
          zOrder={0}
        />
      )}
      <Text>Connection Status: {status}</Text>
      <Button title="Take permission" onPress={handleOnMount} />
      {dataChannel && status !== "connected" && (
        <Button title="Send Hi" onPress={sendMessage} />
      )}
      {stream && status !== "connected" && (
        <Button title="Connect" onPress={() => connect(stream)} />
      )}
    </SafeAreaView>
  );
}
