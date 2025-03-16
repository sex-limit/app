declare interface IGetSexLimitDetailResponse {
  planDayChecked: PlanDayChecked[];
  user: User;
  id: string;
  coverAvatar: any;
  coverEmoji: string;
  color: string;
  title: string;
  desc: string;
  postiveLastestConsutiveEndDate: string;
  postiveLastestConsutiveStartDate: string;
  postiveLongestEndDate: string;
  postiveLongestStartDate: string;
  postiveLatestConsutiveCheckedDays: number;
  postiveLongestCheckedDays: number;
  negativeLatestConsutiveCheckedDays: number;
  negativeLongestCheckedDays: number;
  negativeLastestConsutiveEndDate: string;
  negativeLastestConsutiveStartDate: string;
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
  post: Post;
}

interface Post {
  id: string;
  content: string;
  imgs: string[];
  viewCount: number;
  userId: number;
  planId: any;
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
