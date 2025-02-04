declare interface IPost {
  id: number;
  createAt: string;
  updateAt: string;
  title: string;
  body: string;
  imgs: string[];
  favoriteCounts: number;
  user: User;
  tags: Tag[];
  isLiked: boolean;
  commentCounts: number;
  shareCounts: number;
  ip_location: string;
}

interface User {
  id: number;
  createAt: string;
  username: string;
  avatar: string;
  followed: boolean;
}

interface Tag {
  id: string;
  createAt: string;
  body: string;
}

declare interface IPostCommentListItem {
  id: string;
  createAt: string;
  body: string;
  ip_location: string;
  favoriteCounts: number;
  user: User;
  isLiked: boolean;
  repliesCount: number;
  replies: IPostCommentReplyItem[];
}

declare interface IPostCommentReplyItem {
  id: string;
  createAt: string;
  body: string;
  ip_location: string;
  favoriteCounts: number;
  user: User;
  isLiked: boolean;
  replyTo: User;
}
