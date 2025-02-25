declare interface IGetSexLimitDetailResponse {
  planDayChecked: PlanDayChecked[];
  user: User;
  id: string;
  coverAvatar: string | null;
  coverEmoji: string;
  color: string;
  postiveLastestConsutiveEndDate: string;
  postiveLastestConsutiveStartDate: string;
  postiveLongestEndDate: string;
  postiveLongestStartDate: string;
  postiveLatestConsutiveCheckedDays: number;
  postiveLongestCheckedDays: number;
  negativeLatestConsutiveCheckedDays: number;
  negativeLongestCheckedDays: number;
}

interface PlanDayChecked {
  id: string;
  planId: string;
  checkedTimes: number;
  date: string;
  year: number;
  month: number;
  day: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  username: string;
  avatar: string;
  ipAddress: string;
  desc: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
