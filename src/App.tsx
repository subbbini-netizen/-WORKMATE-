import React, { useState, useEffect } from 'react';
import { 
  loadSchedules, 
  saveSchedules, 
  loadTodos, 
  saveTodos, 
  loadMemos, 
  saveMemos, 
  loadUsername, 
  saveUsername, 
  loadUserProfile,
  saveUserProfile,
  loadFriends,
  saveFriends,
  loadShareRequests,
  saveShareRequests,
  loadChatRooms,
  saveChatRooms,
  loadChatMessages,
  saveChatMessages,
  resetAllData 
} from './utils/storage';
import { 
  ScheduleItem, 
  TodoItem, 
  MemoItem, 
  TabType, 
  PriorityLevel, 
  UserProfile, 
  Friend, 
  ShareRequest, 
  ChatRoom, 
  ChatMessage 
} from './types';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { ScheduleView } from './components/ScheduleView';
import { TodoView } from './components/TodoView';
import { MemoView } from './components/MemoView';
import { ProfileView } from './components/ProfileView';
import { ChatView } from './components/ChatView';
import { BottomNav } from './components/BottomNav';
import { ScheduleModal, TodoModal, MemoModal, QuickAddMenu } from './components/Modals';

export default function App() {
  // --- Persistent State ---
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => loadSchedules());
  const [todos, setTodos] = useState<TodoItem[]>(() => loadTodos());
  const [memos, setMemos] = useState<MemoItem[]>(() => loadMemos());
  const [username, setUsername] = useState<string>(() => loadUsername());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadUserProfile());
  const [friends, setFriends] = useState<Friend[]>(() => loadFriends());
  const [shareRequests, setShareRequests] = useState<ShareRequest[]>(() => loadShareRequests());
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(() => loadChatRooms());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadChatMessages());

  // --- Active Tab State (Dashboard by default or Calendar) ---
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // --- Calendar Sub-view Mode (month calendar vs schedule list) ---
  const [calendarSubMode, setCalendarSubMode] = useState<'calendar' | 'list'>('calendar');

  // --- Chat Active Room State ---
  const [activeChatRoomId, setActiveChatRoomId] = useState<string>(
    chatRooms[0]?.id || 'chat-friend-1'
  );

  // --- Modal States ---
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [scheduleModal, setScheduleModal] = useState<{ 
    isOpen: boolean; 
    item?: ScheduleItem | null; 
    defaultDate?: string;
  }>({
    isOpen: false,
    item: null,
  });
  const [todoModal, setTodoModal] = useState<{ 
    isOpen: boolean; 
    item?: TodoItem | null; 
    defaultDate?: string;
  }>({
    isOpen: false,
    item: null,
  });
  const [memoModal, setMemoModal] = useState<{ 
    isOpen: boolean; 
    item?: MemoItem | null; 
    defaultDate?: string;
  }>({
    isOpen: false,
    item: null,
  });

  // --- Toast notification ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // --- Save to localStorage on state changes ---
  useEffect(() => {
    saveSchedules(schedules);
  }, [schedules]);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  useEffect(() => {
    saveMemos(memos);
  }, [memos]);

  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveFriends(friends);
  }, [friends]);

  useEffect(() => {
    saveShareRequests(shareRequests);
  }, [shareRequests]);

  useEffect(() => {
    saveChatRooms(chatRooms);
  }, [chatRooms]);

  useEffect(() => {
    saveChatMessages(chatMessages);
  }, [chatMessages]);

  const handleUpdateUsername = (newName: string) => {
    setUsername(newName);
    saveUsername(newName);
    setUserProfile((prev) => ({ 
      ...prev, 
      nickname: newName,
      fullTag: `${newName}${prev.tagId}`
    }));
    showToast(`닉네임이 '${newName}'으로 변경되었습니다.`);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    setUsername(updated.nickname);
    saveUsername(updated.nickname);
    saveUserProfile(updated);
  };

  const handleResetProfile = () => {
    const reset = resetAllData();
    setUserProfile(reset.profile);
    setUsername(reset.username);
    showToast('프로필 정보가 기본값으로 복원되었습니다.');
  };

  // --- Reset to Sample Data ---
  const handleResetData = () => {
    if (window.confirm('기본 예시 데이터(일정, 할 일, 메모, 동업자, 대화 내역)로 초기화하시겠습니까?')) {
      const reset = resetAllData();
      setSchedules(reset.schedules);
      setTodos(reset.todos);
      setMemos(reset.memos);
      setUsername(reset.username);
      setUserProfile(reset.profile);
      setFriends(reset.friends);
      setShareRequests(reset.shareRequests);
      setChatRooms(reset.chatRooms);
      setChatMessages(reset.chatMessages);
      showToast('기본 데이터가 복원되었습니다.');
    }
  };

  // --- SHARE REQUEST HANDLERS (Rendered on Dashboard) ---
  const handleAcceptShareRequest = (id: string) => {
    const req = shareRequests.find((r) => r.id === id);
    if (!req) return;

    // Update share request status
    setShareRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'accepted' } : r))
    );

    // Add to schedules list
    const newSchedule: ScheduleItem = {
      ...req.schedule,
      id: `sch-accepted-${Date.now()}`,
      sharedBy: req.fromFullTag || `${req.fromName}${req.fromTag}`,
    };
    setSchedules((prev) => [newSchedule, ...prev]);

    // Send confirmation message to chat
    const matchingRoom = chatRooms.find(
      (room) => room.participantTag === req.fromTag || room.participantName === req.fromName
    );

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (matchingRoom) {
      const confirmMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        roomId: matchingRoom.id,
        senderId: 'me',
        senderName: userProfile.nickname,
        senderTag: userProfile.tagId,
        text: `[일정 수락] '${req.schedule.title}' 일정을 수락하여 캘린더에 등록했습니다.`,
        timestamp: timeStr,
      };
      setChatMessages((prev) => [...prev, confirmMsg]);
    }

    showToast(`'${req.schedule.title}' 일정을 수락하여 캘린더에 추가했습니다.`);
  };

  const handleDeclineShareRequest = (id: string) => {
    const req = shareRequests.find((r) => r.id === id);
    setShareRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r))
    );
    showToast(req ? `'${req.schedule.title}' 일정 공유 요청을 거절했습니다.` : '일정 공유를 거절했습니다.');
  };

  // --- CHAT & FRIEND HANDLERS ---
  const handleOpenChatWithFriend = (friendTagOrName: string, scheduleTitle?: string) => {
    // Find room matching friend
    let targetRoom = chatRooms.find(
      (r) =>
        r.participantTag === friendTagOrName ||
        r.participantName === friendTagOrName ||
        r.title === friendTagOrName ||
        `${r.participantName}${r.participantTag}` === friendTagOrName
    );

    if (!targetRoom) {
      // Create new chat room if not existing
      const cleanName = friendTagOrName.includes('#')
        ? friendTagOrName.split('#')[0]
        : friendTagOrName;
      const cleanTag = friendTagOrName.includes('#')
        ? '#' + friendTagOrName.split('#')[1]
        : '#0000';

      const newRoom: ChatRoom = {
        id: `chat-${Date.now()}`,
        type: 'direct',
        title: `${cleanName}${cleanTag}`,
        participantName: cleanName,
        participantTag: cleanTag,
        participantAvatar: 'avatar-2',
        lastMessage: '대화를 시작했습니다.',
        lastMessageTime: '방금',
        unreadCount: 0,
      };

      setChatRooms((prev) => [newRoom, ...prev]);
      targetRoom = newRoom;
    }

    setActiveChatRoomId(targetRoom.id);
    setCurrentTab('chat');

    // If scheduleTitle was passed, post a note or clear unread count
    setChatRooms((prev) =>
      prev.map((r) => (r.id === targetRoom?.id ? { ...r, unreadCount: 0 } : r))
    );
  };

  const handleSendMessage = (roomId: string, text: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      roomId,
      senderId: 'me',
      senderName: userProfile.nickname,
      senderTag: userProfile.tagId,
      text,
      timestamp: timeStr,
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Update room last message
    setChatRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              lastMessage: text,
              lastMessageTime: timeStr,
            }
          : room
      )
    );
  };

  const handleAddFriend = (friendTagInput: string): boolean => {
    if (!friendTagInput.includes('#')) {
      return false;
    }

    const parts = friendTagInput.trim().split('#');
    const name = parts[0].trim() || '동업자';
    const tag = '#' + parts[1].trim();

    if (!parts[1].trim() || parts[1].trim().length < 2) {
      return false;
    }

    // Check if already friends
    const exists = friends.some((f) => f.tag === tag && f.name === name);
    if (exists) {
      showToast('이미 등록된 동업자입니다.');
      return true;
    }

    const newFriend: Friend = {
      id: `friend-${Date.now()}`,
      name,
      tag,
      fullTag: `${name}${tag}`,
      statusMessage: '새로운 동업자',
      avatar: 'avatar-1',
      unreadCount: 0,
    };

    setFriends((prev) => [...prev, newFriend]);

    // Also auto-create a chat room for convenient 1:1 conversation
    const newRoom: ChatRoom = {
      id: `chat-${Date.now()}`,
      type: 'direct',
      title: `${name}${tag}`,
      participantName: name,
      participantTag: tag,
      participantAvatar: 'avatar-1',
      lastMessage: '새로운 대화방이 생성되었습니다.',
      lastMessageTime: '방금',
      unreadCount: 0,
    };
    setChatRooms((prev) => [newRoom, ...prev]);

    return true;
  };

  // --- SCHEDULE HANDLERS ---
  const handleSaveSchedule = (itemData: Omit<ScheduleItem, 'id'>, id?: string) => {
    if (id) {
      // Edit existing
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...itemData, id } : s))
      );
      showToast('일정이 수정되었습니다.');
    } else {
      // Create new
      const newSchedule: ScheduleItem = {
        ...itemData,
        id: `sch-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      setSchedules((prev) => [newSchedule, ...prev]);

      // If friend sharing was selected, send invite card to their chat room!
      if (itemData.sharedWith && itemData.sharedWith.length > 0) {
        const friendTagOrName = itemData.sharedWith[0];
        const matchingRoom = chatRooms.find(
          (r) =>
            r.participantTag === friendTagOrName ||
            r.participantName === friendTagOrName ||
            r.title === friendTagOrName ||
            `${r.participantName}${r.participantTag}` === friendTagOrName
        );

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        if (matchingRoom) {
          const inviteMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            roomId: matchingRoom.id,
            senderId: 'me',
            senderName: userProfile.nickname,
            senderTag: userProfile.tagId,
            text: `'${itemData.title}' 일정을 공유했습니다.`,
            timestamp: timeStr,
            scheduleData: {
              scheduleId: newSchedule.id,
              title: itemData.title,
              date: itemData.date,
              time: `${itemData.startTime} - ${itemData.endTime}`,
              location: itemData.location,
            },
          };
          setChatMessages((prev) => [...prev, inviteMsg]);
          setChatRooms((prev) =>
            prev.map((r) =>
              r.id === matchingRoom.id
                ? {
                    ...r,
                    lastMessage: `'${itemData.title}' 일정 공유`,
                    lastMessageTime: timeStr,
                  }
                : r
            )
          );
        }

        showToast(`'${itemData.title}' 일정이 저장되고 ${friendTagOrName}님에게 공유되었습니다.`);
      } else {
        showToast('새 일정이 등록되었습니다.');
      }
    }
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    showToast('일정이 삭제되었습니다.');
  };

  // --- TODO HANDLERS ---
  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          if (next) {
            showToast('할 일을 완료했습니다.');
          }
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  const handleAddQuickTodo = (title: string, priority: PriorityLevel, dueDate?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      dueDate: dueDate || todayStr,
      priority,
      completed: false,
    };
    setTodos((prev) => [newTodo, ...prev]);
    showToast('새 할 일이 등록되었습니다.');
  };

  const handleSaveTodo = (itemData: Omit<TodoItem, 'id' | 'completed'>, id?: string) => {
    if (id) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...itemData } : t))
      );
      showToast('할 일이 수정되었습니다.');
    } else {
      const newTodo: TodoItem = {
        ...itemData,
        id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        completed: false,
      };
      setTodos((prev) => [newTodo, ...prev]);
      showToast('새 할 일이 등록되었습니다.');
    }
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    showToast('할 일이 삭제되었습니다.');
  };

  // --- MEMO HANDLERS ---
  const handleSaveMemo = (itemData: Omit<MemoItem, 'id'>, id?: string) => {
    if (id) {
      setMemos((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...itemData } : m))
      );
      showToast('메모가 수정되었습니다.');
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      const newMemo: MemoItem = {
        ...itemData,
        id: `memo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: itemData.createdAt || todayStr,
      };
      setMemos((prev) => [newMemo, ...prev]);
      showToast('새 메모가 저장되었습니다.');
    }
  };

  const handleDeleteMemo = (id: string) => {
    setMemos((prev) => prev.filter((m) => m.id !== id));
    showToast('메모가 삭제되었습니다.');
  };

  const handleTogglePinMemo = (id: string) => {
    setMemos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m))
    );
  };

  // --- Quick Add Dispatcher ---
  const handleSelectQuickAddType = (type: 'schedule' | 'todo' | 'memo') => {
    if (type === 'schedule') setScheduleModal({ isOpen: true, item: null });
    if (type === 'todo') setTodoModal({ isOpen: true, item: null });
    if (type === 'memo') setMemoModal({ isOpen: true, item: null });
  };

  // Total unread chat count
  const totalUnreadChats = chatRooms.reduce((acc, r) => acc + (r.unreadCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/90 text-white text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* App Header */}
      <Header
        username={username}
        onUpdateUsername={handleUpdateUsername}
        onResetData={handleResetData}
        todos={todos}
        schedules={schedules}
        memos={memos}
        userProfile={userProfile}
        onNavigateToProfile={() => setCurrentTab('profile')}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 w-full mx-auto ${
          currentTab === 'profile'
            ? 'max-w-md px-4 py-5 sm:py-6'
            : currentTab === 'chat'
            ? 'max-w-5xl px-3 sm:px-4 py-4 sm:py-6'
            : 'max-w-4xl px-4 py-5 sm:py-6'
        }`}
      >
        {/* 1. DASHBOARD VIEW (Includes share requests notification card at top) */}
        {currentTab === 'dashboard' && (
          <DashboardView
            schedules={schedules}
            todos={todos}
            memos={memos}
            shareRequests={shareRequests}
            onAcceptShareRequest={handleAcceptShareRequest}
            onDeclineShareRequest={handleDeclineShareRequest}
            onOpenChatWithFriend={handleOpenChatWithFriend}
            onToggleTodo={handleToggleTodo}
            onOpenScheduleModal={(item) => setScheduleModal({ isOpen: true, item: item || null })}
            onOpenTodoModal={(item) => setTodoModal({ isOpen: true, item: item || null })}
            onOpenMemoModal={(item) => setMemoModal({ isOpen: true, item: item || null })}
            onSaveMemo={handleSaveMemo}
            onTogglePinMemo={handleTogglePinMemo}
            onDeleteSchedule={handleDeleteSchedule}
            onDeleteTodo={handleDeleteTodo}
            onDeleteMemo={handleDeleteMemo}
            onNavigateTab={(tab) => setCurrentTab(tab as TabType)}
          />
        )}


        {/* 2. CALENDAR & SCHEDULE VIEW */}
        {(currentTab === 'calendar' || currentTab === 'schedule') && (
          <div>
            {/* Calendar / List View Mode Toggle Bar */}
            <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-xs p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCalendarSubMode('calendar')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    calendarSubMode === 'calendar'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  월별 캘린더
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarSubMode('list')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    calendarSubMode === 'list'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  타임라인 목록
                </button>
              </div>

              <span className="text-[11px] text-slate-400 pr-2 hidden sm:inline">
                {calendarSubMode === 'calendar' ? '날짜별 일정 및 할 일 종합 뷰' : '전체 일정 시간표'}
              </span>
            </div>

            {calendarSubMode === 'calendar' ? (
              <CalendarView
                schedules={schedules}
                todos={todos}
                onToggleTodo={handleToggleTodo}
                onOpenScheduleModal={(item, defaultDate) => 
                  setScheduleModal({ isOpen: true, item: item || null, defaultDate })
                }
                onOpenTodoModal={(item, defaultDate) => 
                  setTodoModal({ isOpen: true, item: item || null, defaultDate })
                }
                onDeleteSchedule={handleDeleteSchedule}
                onDeleteTodo={handleDeleteTodo}
                onAddQuickTodo={handleAddQuickTodo}
              />
            ) : (
              <ScheduleView
                schedules={schedules}
                onOpenScheduleModal={(item) => setScheduleModal({ isOpen: true, item: item || null })}
                onDeleteSchedule={handleDeleteSchedule}
              />
            )}
          </div>
        )}

        {/* 3. CHAT VIEW (1:1 messaging with friends and schedule integration) */}
        {currentTab === 'chat' && (
          <ChatView
            rooms={chatRooms}
            messages={chatMessages}
            friends={friends}
            userProfile={userProfile}
            activeRoomId={activeChatRoomId}
            onSelectRoom={(roomId) => setActiveChatRoomId(roomId)}
            onSendMessage={handleSendMessage}
            onNavigateToCalendar={() => setCurrentTab('calendar')}
          />
        )}

        {/* 4. PROFILE VIEW (Simplified: Nickname, Bio, Tag ID, Friends) */}
        {currentTab === 'profile' && (
          <ProfileView
            profile={userProfile}
            friends={friends}
            onUpdateProfile={handleUpdateProfile}
            onAddFriend={handleAddFriend}
            onOpenChatWithFriend={(friendTag) => handleOpenChatWithFriend(friendTag)}
            onResetProfile={handleResetProfile}
            todos={todos}
            schedules={schedules}
            memos={memos}
            onShowToast={showToast}
          />
        )}

        {/* Sub-pages accessible from dashboard */}
        {currentTab === 'todo' && (
          <TodoView
            todos={todos}
            onToggleTodo={handleToggleTodo}
            onAddQuickTodo={handleAddQuickTodo}
            onOpenTodoModal={(item) => setTodoModal({ isOpen: true, item: item || null })}
            onDeleteTodo={handleDeleteTodo}
          />
        )}

        {currentTab === 'memo' && (
          <MemoView
            memos={memos}
            onOpenMemoModal={(item) => setMemoModal({ isOpen: true, item: item || null })}
            onDeleteMemo={handleDeleteMemo}
            onTogglePin={handleTogglePinMemo}
          />
        )}
      </main>

      {/* Bottom Navigation (Fixed 4 Tabs: Dashboard, Calendar, Chat, Profile) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        schedulesCount={schedules.length}
        todosActiveCount={todos.filter((t) => !t.completed).length}
        memosCount={memos.length}
        unreadChatsCount={totalUnreadChats}
      />

      {/* Unified Modals */}
      <ScheduleModal
        isOpen={scheduleModal.isOpen}
        onClose={() => setScheduleModal({ isOpen: false, item: null, defaultDate: undefined })}
        onSave={handleSaveSchedule}
        onDelete={handleDeleteSchedule}
        initialData={scheduleModal.item}
        defaultDate={scheduleModal.defaultDate}
        friends={friends}
      />

      <TodoModal
        isOpen={todoModal.isOpen}
        onClose={() => setTodoModal({ isOpen: false, item: null, defaultDate: undefined })}
        onSave={handleSaveTodo}
        onDelete={handleDeleteTodo}
        initialData={todoModal.item}
        defaultDate={todoModal.defaultDate}
      />

      <MemoModal
        isOpen={memoModal.isOpen}
        onClose={() => setMemoModal({ isOpen: false, item: null, defaultDate: undefined })}
        onSave={handleSaveMemo}
        onDelete={handleDeleteMemo}
        initialData={memoModal.item}
        defaultDate={memoModal.defaultDate}
      />

      <QuickAddMenu
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSelectType={handleSelectQuickAddType}
      />
    </div>
  );
}
