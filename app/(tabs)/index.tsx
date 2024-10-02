import { useSetupConnection } from "@/react-native-sdk/useSetupConnection";
import { useWebRTC } from "@/react-native-sdk/useWebRTC";
import React from "react";
import { Text, SafeAreaView, Button } from "react-native";
import { RTCView, registerGlobals } from "react-native-webrtc";

registerGlobals();

export default function HomeScreen() {
  const { stream, handleOnMount } = useSetupConnection();
  const { connect, remoteTrack } = useWebRTC();

  console.log("Connection", remoteTrack);

  return (
    <SafeAreaView>
      <Text>Hello World, this is working</Text>
      <Text>Hello World, this is working</Text>
      <Text>Hello World, this is working</Text>
      <Text>Hello World, this is working</Text>
      <Text>Hello World, this is working</Text>
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
      <Text>Hello World, this is working last</Text>
      <Button title="Take permission" onPress={handleOnMount} />
      {stream && <Button title="Connect" onPress={() => connect(stream)} />}
    </SafeAreaView>
  );
}
