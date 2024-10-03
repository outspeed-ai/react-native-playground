import { useSetupConnection } from "@/react-native-sdk/useSetupConnection";
import { useWebRTC } from "@/react-native-sdk/useWebRTC";
import React from "react";
import { Text, SafeAreaView, Button, TextInput } from "react-native";
import { RTCView, registerGlobals } from "react-native-webrtc";
import CheckBox from "@react-native-community/checkbox";

registerGlobals();

export default function HomeScreen() {
  const { stream, handleOnMount } = useSetupConnection();
  const { connect, remoteTrack, dataChannel, status } = useWebRTC();
  const [functionURL, onChangeFunctionURL] = React.useState("http://192.168.");
  const [hasAudio, setHasAudio] = React.useState(true);
  const [hasVideo, setHasVideo] = React.useState(false);

  const sendMessage = React.useCallback(() => {
    dataChannel.send(JSON.stringify({ type: "message", data: "Hello!" }));
  }, [dataChannel]);

  return (
    <SafeAreaView
      style={{
        display: "flex",
        marginTop: 50,
      }}
    >
      <Text>Function URL</Text>
      <TextInput
        style={{ borderColor: "blue", borderWidth: 1 }}
        value={functionURL}
        onChangeText={onChangeFunctionURL}
        placeholder="Enter function url here"
      />
      <Text>Audio</Text>
      <CheckBox
        disabled={false}
        value={hasAudio}
        onValueChange={(newValue) => setHasAudio(newValue)}
      />
      <Text>Video</Text>
      <CheckBox
        disabled={false}
        value={hasVideo}
        onValueChange={(newValue) => setHasVideo(newValue)}
      />

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
      <Button
        title="Take permission"
        onPress={() => handleOnMount(hasAudio, hasVideo)}
      />
      {dataChannel && status === "connected" && (
        <Button title="Send Hi" onPress={sendMessage} />
      )}
      {stream && status !== "connected" && (
        <Button title="Connect" onPress={() => connect(functionURL, stream)} />
      )}
    </SafeAreaView>
  );
}
