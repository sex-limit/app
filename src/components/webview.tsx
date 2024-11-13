import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

export default function WebViewComponent() {
  const webviewRef = useRef<WebView>(null);
  const [url, setUrl] = useState('http://192.168.18.184:5173/');
  const [inputUrl, setInputUrl] = useState('');

  const onMessage = (event: WebViewMessageEvent) => {
    const { data } = event.nativeEvent;
    console.log('Message received from webview:', data);
    Alert.alert('Message from WebView', data);
    // Handle the message received from the webview
  };

  const injectJSBridge = `
    (function() {
      if (window.jsb) {
        return;
      }
      window.jsb = {
        invoke: function(action) {
          window.ReactNativeWebView.postMessage(action);
        },
        receiveMessage: function(callback) {
          window.addEventListener('message', function(event) {
            callback(event.data);
        }
      };
    })();
  `;

  const sendMessageToWebView = (message: string) => {
    if (webviewRef.current) {
      webviewRef.current.postMessage(message);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      sendMessageToWebView('Hello from React Native!');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <TextInput
          style={{
            flex: 1,
            borderColor: 'gray',
            borderWidth: 1,
            marginRight: 10,
            padding: 5,
          }}
          placeholder="Enter URL"
          value={inputUrl}
          onChangeText={setInputUrl}
        />
        <Button title="Load URL" onPress={() => setUrl(inputUrl)} />
      </View>
      <WebView
        ref={webviewRef}
        style={{ flex: 1 }}
        source={{ uri: url }}
        onMessage={onMessage}
        injectedJavaScriptBeforeContentLoaded={injectJSBridge}
      />
    </View>
  );
}
