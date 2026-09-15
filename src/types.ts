export interface ScheduleItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location?: string;
  notes?: string;
  color?: string;
  sharedWith?: string[]; // Array of friend tags (e.g., ['이지민#3190'])
  sharedBy?: string; // Friend tag who shared this (e.g., '이지민#3190')
  sharedStatus?: 'pending' | 'accepted' | 'declined';
  chatRoomId?: string;
}

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface TodoItem {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  priority: PriorityLevel; // 'high', 'medium', 'low'
  completed: boolean;
  notes?: string;
}

export interface MemoItem {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO or YYYY-MM-DD
  color?: string; // 'yellow' | 'pink' | 'mint' | 'blue' | 'purple' | 'lavender'
  pinned?: boolean;
  category?: string; // '아이디어' | '업무' | '회의록' | '개인'
  sticker?: string; // 'flower' | 'heart' | 'thankyou' | 'star' | 'sparkle'
  sharedWith?: string; // friend tag
}


export interface ShareRequest {
  id: string;
  fromName: string;
  fromTag: string; // e.g. '#3190'
  fromFullTag: string; // e.g. '이지민#3190'
  fromAvatar?: string;
  schedule: ScheduleItem;
  createdAt: string; // e.g. '10:20'
  status: 'pending' | 'accepted' | 'declined';
}

export interface Friend {
  id: string;
  name: string;
  tag: string; // e.g. '#3190'
  fullTag: string; // e.g. '이지민#3190'
  statusMessage: string;
  avatar: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string; // 'me' | friend id
  senderName: string;
  senderTag: string;
  text: string;
  timestamp: string; // HH:MM
  scheduleData?: {
    scheduleId: string;
    title: string;
    date: string;
    time: string;
    location?: string;
  };
}

export interface ChatRoom {
  id: string;
  type: 'direct' | 'schedule';
  title: string;
  participantName: string;
  participantTag: string;
  participantAvatar: string;
  scheduleId?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface UserProfile {
  nickname: string;
  tagId: string; // e.g. '#4829'
  fullTag: string; // e.g. 'Subbbini#4829'
  bio: string; // 한 줄 소개
  statusMessage: string; // 상태 메시지
  statusUpdatedAt?: string; // Optional
  avatarUrl: string;
}

export type TabType = 'dashboard' | 'calendar' | 'chat' | 'profile' | 'todo' | 'memo';

export type ModalType = 'schedule' | 'todo' | 'memo' | null;

