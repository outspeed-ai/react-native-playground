import React from "react";
import { Text, SafeAreaView, Button, TextInput } from "react-native";
import { registerGlobals } from "react-native-webrtc";
import CheckBox from "@react-native-community/checkbox";
import {
  useWebRTC,
  RealtimePlayer,
  createConfig,
  ConsoleLogger,
} from "@outspeed/react-native";
import InCallManager from "react-native-incall-manager";

registerGlobals();

export default function HomeScreen() {
  const { connect, remoteStreams, dataChannel, connectionStatus } = useWebRTC();
  const [offerURL, onOfferURLChange] = React.useState("");
  const [hasAudio, setHasAudio] = React.useState(true);
  const [hasVideo, setHasVideo] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const sendMessage = React.useCallback(
    (data: string) => {
      if (!dataChannel) return;
      dataChannel.send(JSON.stringify({ type: "message", content: data }));
    },
    [dataChannel]
  );

  const createConfigAndConnect = React.useCallback(async () => {
    InCallManager.setSpeakerphoneOn(true);
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

      {remoteStreams[0] && (
        <RealtimePlayer streamURL={remoteStreams[0].toURL()} />
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
