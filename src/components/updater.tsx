import * as fs from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Button, NativeModules, Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { UpdatesModule: RCTUpdatesModule } = NativeModules;

// 获取当前使用的bundle URL
const getBundleURL = async () => {
  return await RCTUpdatesModule.getBundleURL();
};

export function Updater() {
  const [bundlePath, setBundlePath] = useState('');

  useEffect(() => {
    getBundleURL().then((url) => {
      setBundlePath(url);
    });
  }, []);
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => getBundleURL()}>
        <Text>我的世界</Text>
      </TouchableOpacity>
      <TextInput value={fs.bundleDirectory || ''} />
      <TextInput value={fs.documentDirectory || ''} />
      <TextInput value={fs.cacheDirectory || ''} />

      <Button
        title="getBundleURL"
        onPress={async () => {
          RCTUpdatesModule.getBundleURL().then((url) => {
            setBundlePath(url);
          });
        }}
      />
      <Button
        title="setBundlePath"
        onPress={async () => {
          await RCTUpdatesModule.setBundlePath('1');
        }}
      />
      <Button
        title="reloadBundleWithURL"
        onPress={async () => {
          await RCTUpdatesModule.reloadBundleWithURL(bundlePath);
          RCTUpdatesModule.getBundleURL().then((url) => {
            setBundlePath(url);
          });
        }}
      />
      <Text>{bundlePath}</Text>
      <Button
        title="reloadBundle"
        onPress={async () => {
          await RCTUpdatesModule.reloadBundle();
        }}
      />
      <Button
        title="reload"
        onPress={async () => {
          await RCTUpdatesModule.reload(bundlePath);
        }}
      />
    </SafeAreaView>
  );
}
