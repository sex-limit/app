import { View, Text } from "react-native"
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import React from "react";
import HomeScreenRecoverProgress from "./RecoverProgress";
import HomeHeaderActions from "./Actions";
import { Button } from "@/ui";
import * as Sentry from '@sentry/react-native';

const HomeHeader: React.FC = () => {

  return (
    <View className="flex-1">
      {/* App Title and User Status */}
      <View className="flex-row items-center justify-between px-4 pt-2">
        <View className="flex-row items-center">
          <FontAwesome name="apple" size={24} color="black" />
          <Text className="ml-2 text-2xl font-bold">Cal AI</Text>
        </View>
        <View className="flex-row items-center">
          <View className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-gray-200">
            <Ionicons name="person" size={18} color="black" />
          </View>
          <View className="flex-row items-center rounded-full bg-gray-200 px-3 py-1">
            <FontAwesome name="fire" size={16} color="#FF6B35" />
            <Text className="ml-1 font-bold">15</Text>
          </View>
        </View>
      </View>

      {/* Date Selector */}
      {/* <HomeHeaderDay /> */}

      <HomeScreenRecoverProgress />

      <HomeHeaderActions />


    </View>
  )
}

export default HomeHeader;