declare interface IGetSexLimitDetailResponse {
  planDayChecked: PlanDayChecked[];
  user: User;
  id: string;
  coverAvatar: string | null;
  coverEmoji: string;
  color: string;
  title: string;
  postiveLastestConsutiveEndDate: string;
  postiveLastestConsutiveStartDate: string;
  postiveLongestEndDate: string;
  postiveLongestStartDate: string;
  postiveLatestConsutiveCheckedDays: number;
  postiveLongestCheckedDays: number;
  negativeLatestConsutiveCheckedDays: number;
  negativeLongestCheckedDays: number;
}

declare interface IGetSexLimitCheckedResponse {
  id: string;
  coverAvatar: string;
  coverEmoji: string;
  color: string;
  title: string;
  desc: string;
  school: string;
  checkedDays: string[];
  postiveCheckedDays: string[];
  negativeCheckedDays: string[];
  postiveLongestStartDate: string;
  postiveLongestEndDate: string;
  postiveLongestCheckedDays: number;
  postiveLastestConsutiveStartDate: string;
  postiveLastestConsutiveEndDate: string;
  postiveLatestConsutiveCheckedDays: number;
  negativeLongestStartDate: string;
  negativeLongestEndDate: string;
  negativeLongestCheckedDays: number;
  negativeLastestConsutiveStartDate: string;
  negativeLastestConsutiveEndDate: string;
  negativeLatestConsutiveCheckedDays: number;
  officalPlanType: string;
  userId: number;
  everdayShouldCheckTimes: number;
  continuousCheckDay: number;
  maxContinuousCheckDay: number;
  createdAt: string;
  updatedAt: string;
  planDayChecked: PlanDayChecked[];
  user: User;
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
  post: Post | null;
}

declare interface Post {
  id: string;
  content: string;
  imgs: string[];
  viewCount: number;
  userId: number;
  planId: string | null;
  planDayCheckedId: string;
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
