import { BottomSheetView } from "@gorhom/bottom-sheet"
import { View, Text } from "react-native"
import { Button } from "@/ui"
import { useGlobalBottomSheet } from "@/store/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";


import React from 'react';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


export const RelapseCheckIn: React.FC = () => {
  const strongCount = 22299;

  const onStillGoingStrong = () => {
    console.log('onStillGoingStrong');
  }

  const onRelapsed = () => {
    console.log('onRelapsed');
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <View className="flex-1 px-4 pt-4">
        <Text className="text-gray-800 text-2xl font-bold mb-2">
          Did you relapse? Let the community know by checking in.
        </Text>

        <View className="my-8">
          <Text className="text-gray-800 text-6xl font-bold">
            {strongCount.toLocaleString()}
          </Text>
          <Text className="text-gray-600 text-lg mt-1">
            are still going strong
          </Text>
        </View>

        <View className="mt-auto">
          <Button
            variant="secondary"
            className="bg-blue-600 border-0 mb-4"
            onPress={onStillGoingStrong}
          >
            <Text className="text-white text-center font-bold flex-row items-center">
              No, still going strong 💪
            </Text>
          </Button>

          <Button
            variant="secondary"
            className="bg-[#ff2727] border-0"
            onPress={onRelapsed}
            virbate={'impactHeavy'}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white mr-2">⚠️</Text>
              <Text className="text-white text-center font-bold">
                Yes, I relapsed
              </Text>
            </View>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const TrustAndShowCompletionPeople: React.FC = () => {
  return (
    <BottomSheetView className="px-6 pt-6 flex-1">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View className="flex-1 items-center justify-between">
          <View className={'flex-col gap-y-4'}>
            <Text className="text-gray-800 text-3xl text-center font-bold mb-4">QUITTR 相信你，永不放弃。👑</Text>

            <View className="w-full mb-3 flex-row items-center">
              <Text className="text-[36px] mr-2">😊</Text>
              <Text className="text-gray-800 text-[36px] font-bold">14,533人</Text>
            </View>

            <View className="w-full mb-3 flex-row items-center">
              <Text className="text-[36px] mr-2">😐</Text>
              <Text className="text-gray-800 text-[36px] font-bold">6,727人</Text>
            </View>

            <View className="w-full mb-6 flex-row items-center">
              <Text className="text-[36px] mr-2">😔</Text>
              <Text className="text-gray-800 text-[36px] font-bold">3,740人</Text>
            </View>
          </View>


          <View className="w-full items-center">
            <Text className="text-gray-600 text-base mb-6">这很困难，但要相信自己。你并不孤单。</Text>

            <View className="w-full">
              <Button
                variant="primary"
                className="flex-1 w-full"
                text="反思"
                onPress={() => { }}
              >
                <Text className="text-white text-center font-bold">反思</Text>
              </Button>

              <Button
                variant="text"
                className="w-full"
                onPress={() => {
                  close()
                }}
              >
                <Text className="text-black text-center font-bold">完成</Text>
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </BottomSheetView>
  )
}


const HomeDailyRecapBottomSheet: React.FC = () => {
  const { close } = useGlobalBottomSheet();

  return (
    <RelapseCheckIn />
  )
}

export default HomeDailyRecapBottomSheet;