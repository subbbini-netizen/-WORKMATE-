import { ScheduleItem, TodoItem, MemoItem, UserProfile, Friend, ShareRequest, ChatRoom, ChatMessage } from '../types';
import { getInitialSchedules, getInitialTodos, getInitialMemos, getTodayDateString } from '../data/initialData';

const SCHEDULES_KEY = 'workmate_schedules';
const TODOS_KEY = 'workmate_todos';
const MEMOS_KEY = 'workmate_memos';
const PROFILE_KEY = 'workmate_user_profile';
const FRIENDS_KEY = 'workmate_friends';
const SHARE_REQUESTS_KEY = 'workmate_share_requests';
const CHAT_ROOMS_KEY = 'workmate_chat_rooms';
const CHAT_MESSAGES_KEY = 'workmate_chat_messages';

// 4-digit Discord-style unique code generator (#1000 - #9999)
export const generateTagId = (): string => {
  return '#' + String(Math.floor(1000 + Math.random() * 9000));
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  nickname: 'Subbbini',
  tagId: '#4829',
  fullTag: 'Subbbini#4829',
  bio: '오늘도 효율적인 하루를 만듭니다.',
  statusMessage: '디자인 미팅 중',
  avatarUrl: 'avatar-1',
};


export const DEFAULT_FRIENDS: Friend[] = [
  {
    id: 'friend-1',
    name: '이지민',
    tag: '#3190',
    fullTag: '이지민#3190',
    statusMessage: '디자인 스프린트 준비 중',
    avatar: 'avatar-2',
    unreadCount: 1,
  },
  {
    id: 'friend-2',
    name: '박성호',
    tag: '#7421',
    fullTag: '박성호#7421',
    statusMessage: '백엔드 API 최적화 작업',
    avatar: 'avatar-3',
    unreadCount: 0,
  },
  {
    id: 'friend-3',
    name: '최유진',
    tag: '#1082',
    fullTag: '최유진#1082',
    statusMessage: '마케팅 캠페인 릴리즈',
    avatar: 'avatar-4',
    unreadCount: 0,
  },
];

export const getDefaultShareRequests = (): ShareRequest[] => {
  const today = getTodayDateString();
  return [
    {
      id: 'req-1',
      fromName: '이지민',
      fromTag: '#3190',
      fromFullTag: '이지민#3190',
      fromAvatar: 'avatar-2',
      createdAt: '10:20',
      status: 'pending',
      schedule: {
        id: 'sch-shared-1',
        title: 'Q3 프로덕트 로드맵 얼라인먼트',
        date: today,
        startTime: '15:00',
        endTime: '16:00',
        location: '디자인 스튜디오 A실',
        notes: '디자인팀과 기능 명세 및 출시 일정 조율',
        color: 'purple',
        sharedBy: '이지민#3190',
      },
    },
  ];
};

export const DEFAULT_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'chat-friend-1',
    type: 'direct',
    title: '이지민#3190',
    participantName: '이지민',
    participantTag: '#3190',
    participantAvatar: 'avatar-2',
    lastMessage: '네! 로드맵 일정 공유드렸어요 확인 부탁드려요 :)',
    lastMessageTime: '10:22',
    unreadCount: 1,
  },
  {
    id: 'chat-friend-2',
    type: 'direct',
    title: '박성호#7421',
    participantName: '박성호',
    participantTag: '#7421',
    participantAvatar: 'avatar-3',
    lastMessage: 'API 연동 규격서 전달드렸습니다.',
    lastMessageTime: '어제',
    unreadCount: 0,
  },
];

export const DEFAULT_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    roomId: 'chat-friend-1',
    senderId: 'friend-1',
    senderName: '이지민',
    senderTag: '#3190',
    text: '수빈님 오늘 오후 일정 괜찮으신가요?',
    timestamp: '10:15',
  },
  {
    id: 'msg-2',
    roomId: 'chat-friend-1',
    senderId: 'me',
    senderName: 'Subbbini',
    senderTag: '#4829',
    text: '네 오후 3시 이후에는 괜찮습니다!',
    timestamp: '10:18',
  },
  {
    id: 'msg-3',
    roomId: 'chat-friend-1',
    senderId: 'friend-1',
    senderName: '이지민',
    senderTag: '#3190',
    text: '그럼 로드맵 미팅 일정 공유해둘게요!',
    timestamp: '10:20',
  },
  {
    id: 'msg-4',
    roomId: 'chat-friend-1',
    senderId: 'friend-1',
    senderName: '이지민',
    senderTag: '#3190',
    text: '네! 로드맵 일정 공유드렸어요 확인 부탁드려요 :)',
    timestamp: '10:22',
    scheduleData: {
      scheduleId: 'sch-shared-1',
      title: 'Q3 프로덕트 로드맵 얼라인먼트',
      date: '오늘',
      time: '15:00 - 16:00',
      location: '디자인 스튜디오 A실',
    },
  },
  {
    id: 'msg-5',
    roomId: 'chat-friend-2',
    senderId: 'friend-2',
    senderName: '박성호',
    senderTag: '#7421',
    text: 'API 연동 규격서 전달드렸습니다.',
    timestamp: '어제 17:40',
  },
];

export const loadSchedules = (): ScheduleItem[] => {
  try {
    const raw = localStorage.getItem(SCHEDULES_KEY);
    if (!raw) {
      const initial = getInitialSchedules();
      saveSchedules(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load schedules from localStorage', error);
    return getInitialSchedules();
  }
};

export const saveSchedules = (items: ScheduleItem[]): void => {
  try {
    localStorage.setItem(SCHEDULES_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save schedules to localStorage', error);
  }
};

export const loadTodos = (): TodoItem[] => {
  try {
    const raw = localStorage.getItem(TODOS_KEY);
    if (!raw) {
      const initial = getInitialTodos();
      saveTodos(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load todos from localStorage', error);
    return getInitialTodos();
  }
};

export const saveTodos = (items: TodoItem[]): void => {
  try {
    localStorage.setItem(TODOS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save todos to localStorage', error);
  }
};

export const loadMemos = (): MemoItem[] => {
  try {
    const raw = localStorage.getItem(MEMOS_KEY);
    if (!raw) {
      const initial = getInitialMemos();
      saveMemos(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load memos from localStorage', error);
    return getInitialMemos();
  }
};

export const saveMemos = (items: MemoItem[]): void => {
  try {
    localStorage.setItem(MEMOS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save memos to localStorage', error);
  }
};

export const loadUsername = (): string => {
  try {
    const prof = loadUserProfile();
    return prof.nickname || 'Subbbini';
  } catch {
    return 'Subbbini';
  }
};

export const saveUsername = (name: string): void => {
  try {
    const prof = loadUserProfile();
    prof.nickname = name;
    prof.fullTag = `${name}${prof.tagId}`;
    saveUserProfile(prof);
  } catch (error) {
    console.error('Failed to save username to localStorage', error);
  }
};

export const loadUserProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      saveUserProfile(DEFAULT_USER_PROFILE);
      return DEFAULT_USER_PROFILE;
    }
    const parsed = JSON.parse(raw);
    const nickname = parsed.nickname || parsed.name || DEFAULT_USER_PROFILE.nickname;
    const tagId = parsed.tagId || DEFAULT_USER_PROFILE.tagId;
    return {
      nickname,
      tagId,
      fullTag: `${nickname}${tagId}`,
      bio: parsed.bio || DEFAULT_USER_PROFILE.bio,
      statusMessage: parsed.statusMessage || parsed.statusNote || DEFAULT_USER_PROFILE.statusMessage,
      statusUpdatedAt: parsed.statusUpdatedAt || DEFAULT_USER_PROFILE.statusUpdatedAt,
      avatarUrl: parsed.avatarUrl || DEFAULT_USER_PROFILE.avatarUrl,
    };
  } catch (error) {
    console.error('Failed to load user profile from localStorage', error);
    return DEFAULT_USER_PROFILE;
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save user profile to localStorage', error);
  }
};

export const loadFriends = (): Friend[] => {
  try {
    const raw = localStorage.getItem(FRIENDS_KEY);
    if (!raw) {
      saveFriends(DEFAULT_FRIENDS);
      return DEFAULT_FRIENDS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_FRIENDS;
  }
};

export const saveFriends = (friends: Friend[]): void => {
  try {
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(friends));
  } catch (error) {
    console.error('Failed to save friends to localStorage', error);
  }
};

export const loadShareRequests = (): ShareRequest[] => {
  try {
    const raw = localStorage.getItem(SHARE_REQUESTS_KEY);
    if (!raw) {
      const initial = getDefaultShareRequests();
      saveShareRequests(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getDefaultShareRequests();
  }
};

export const saveShareRequests = (requests: ShareRequest[]): void => {
  try {
    localStorage.setItem(SHARE_REQUESTS_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error('Failed to save share requests to localStorage', error);
  }
};

export const loadChatRooms = (): ChatRoom[] => {
  try {
    const raw = localStorage.getItem(CHAT_ROOMS_KEY);
    if (!raw) {
      saveChatRooms(DEFAULT_CHAT_ROOMS);
      return DEFAULT_CHAT_ROOMS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CHAT_ROOMS;
  }
};

export const saveChatRooms = (rooms: ChatRoom[]): void => {
  try {
    localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms));
  } catch (error) {
    console.error('Failed to save chat rooms to localStorage', error);
  }
};

export const loadChatMessages = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(CHAT_MESSAGES_KEY);
    if (!raw) {
      saveChatMessages(DEFAULT_CHAT_MESSAGES);
      return DEFAULT_CHAT_MESSAGES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CHAT_MESSAGES;
  }
};

export const saveChatMessages = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save chat messages to localStorage', error);
  }
};

export const resetAllData = () => {
  try {
    localStorage.removeItem(SCHEDULES_KEY);
    localStorage.removeItem(TODOS_KEY);
    localStorage.removeItem(MEMOS_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(FRIENDS_KEY);
    localStorage.removeItem(SHARE_REQUESTS_KEY);
    localStorage.removeItem(CHAT_ROOMS_KEY);
    localStorage.removeItem(CHAT_MESSAGES_KEY);
  } catch (e) {
    console.error('Error clearing localStorage', e);
  }
  return {
    schedules: getInitialSchedules(),
    todos: getInitialTodos(),
    memos: getInitialMemos(),
    username: DEFAULT_USER_PROFILE.nickname,
    profile: DEFAULT_USER_PROFILE,
    friends: DEFAULT_FRIENDS,
    shareRequests: getDefaultShareRequests(),
    chatRooms: DEFAULT_CHAT_ROOMS,
    chatMessages: DEFAULT_CHAT_MESSAGES,
  };
};

