import { NativeModules } from 'react-native';

import { type DouyinModuleInterface } from '@/shared/native-module/douyin/types';

const Douyin = NativeModules.DouyinModule as DouyinModuleInterface;

export default Douyin;
