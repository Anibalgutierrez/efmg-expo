export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow';

export type Notification = {

  id: string;

  type:
    NotificationType;

  senderId: string;

  senderName: string;

  senderAvatar?: string;

  postId?: string;

  text: string;

  read: boolean;

  createdAt: any;
};