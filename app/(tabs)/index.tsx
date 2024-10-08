import React from "react";
import { Text, SafeAreaView, Button, TextInput } from "react-native";
import { registerGlobals } from "react-native-webrtc";
import CheckBox from "@react-native-community/checkbox";
import { useWebRTC, RealtimePlayer } from "@outspeed/react-native-sdk";
import { ConsoleLogger } from "@outspeed/core/dist/Logger";
import { createConfig } from "@outspeed/core/dist/create-config";

registerGlobals();

export default function HomeScreen() {
  const { connect, remoteTracks, dataChannel, connectionStatus } = useWebRTC();
  const [offerURL, onOfferURLChange] = React.useState(
    "http://192.168.11.12:8080/offer"
  );
  const [hasAudio, setHasAudio] = React.useState(true);
  const [hasVideo, setHasVideo] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const sendMessage = React.useCallback(
    (data: string) => {
      if (!dataChannel) return;
      dataChannel.send(JSON.stringify({ type: "message", data }));
    },
    [dataChannel]
  );

  const createConfigAndConnect = React.useCallback(async () => {
    const config = createConfig({
      offerURL,
      audioDeviceId: hasAudio ? "default" : "",
      videoDeviceId: hasVideo ? "default" : "",
      logger: ConsoleLogger.getLogger(),
    });

    connect({
      config,
    });
  }, [offerURL, hasAudio, hasVideo, connect]);

  return (
    <SafeAreaView
      style={{
        display: "flex",
        marginTop: 50,
      }}
    >
      <Text>Offer URL</Text>
      <TextInput
        style={{ borderColor: "blue", borderWidth: 1 }}
        value={offerURL}
        onChangeText={onOfferURLChange}
        placeholder="Enter offer url here"
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

      {remoteTracks[0] && (
        <RealtimePlayer streamURL={remoteTracks[0].toURL()} />
      )}

      <Text>Connection Status: {connectionStatus}</Text>
      <Button title="Connect" onPress={createConfigAndConnect} />
      <Text>Type message</Text>
      <TextInput
        style={{ borderColor: "blue", borderWidth: 1 }}
        value={message}
        onChangeText={setMessage}
        placeholder="Your Message"
      />
      <Button
        title="Send Message"
        onPress={() => {
          if (message) {
            sendMessage(message);
            setMessage("");
          }
        }}
      />
    </SafeAreaView>
  );
}
