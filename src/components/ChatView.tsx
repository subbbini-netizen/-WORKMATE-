import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Search, 
  MessageSquare, 
  Check, 
  User, 
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Smile
} from 'lucide-react';
import { ChatRoom, ChatMessage, Friend, UserProfile } from '../types';

interface ChatViewProps {
  rooms: ChatRoom[];
  messages: ChatMessage[];
  friends: Friend[];
  userProfile: UserProfile;
  activeRoomId?: string;
  onSelectRoom: (roomId: string) => void;
  onSendMessage: (roomId: string, text: string) => void;
  onNavigateToCalendar: (date?: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  rooms,
  messages,
  friends,
  userProfile,
  activeRoomId,
  onSelectRoom,
  onSendMessage,
  onNavigateToCalendar,
}) => {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileListOpen, setIsMobileListOpen] = useState(!activeRoomId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Selected active room
  const currentRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  useEffect(() => {
    if (activeRoomId) {
      setIsMobileListOpen(false);
    }
  }, [activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeRoomId]);

  const activeMessages = messages.filter((m) => m.roomId === currentRoom?.id);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !currentRoom) return;
    onSendMessage(currentRoom.id, inputText.trim());
    setInputText('');
  };

  const handleQuickPreset = (preset: string) => {
    if (!currentRoom) return;
    onSendMessage(currentRoom.id, preset);
  };

  const filteredRooms = rooms.filter((r) =>
    r.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.participantTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const QUICK_REPLIES = [
    '일정 확인했습니다.',
    '회의실 예약해둘게요.',
    '자료 먼저 공유 부탁드립니다.',
    '30분 뒤에 뵙겠습니다.',
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-[78vh] min-h-[560px]">
      {/* 1. Left Sidebar: Chat Rooms / Friends List */}
      <div
        className={`w-full md:w-80 md:border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/50 ${
          !isMobileListOpen && activeRoomId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-slate-800 tracking-tight">동업자 채팅</h2>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {rooms.length}개 대화
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="동업자 이름 또는 #태그 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Room list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              대화방이 없습니다.
            </div>
          ) : (
            filteredRooms.map((room) => {
              const isSelected = room.id === currentRoom?.id;
              const friend = friends.find((f) => f.tag === room.participantTag || f.name === room.participantName);

              return (
                <button
                  key={room.id}
                  onClick={() => {
                    onSelectRoom(room.id);
                    setIsMobileListOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border border-blue-200/80 shadow-2xs'
                      : 'hover:bg-white hover:shadow-2xs border border-transparent'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm border-2 border-white shadow-xs">
                      {room.participantName.slice(0, 1)}
                    </div>
                    {/* Online / Active Indicator */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs font-black text-slate-800 truncate">
                          {room.participantName}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {room.participantTag}
                        </span>
                      </div>
                      {room.lastMessageTime && (
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {room.lastMessageTime}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {room.lastMessage || '대화가 시작되었습니다.'}
                    </p>

                    {friend?.statusMessage && (
                      <div className="text-[10px] text-blue-600 truncate mt-0.5 font-medium">
                        상태: {friend.statusMessage}
                      </div>
                    )}
                  </div>

                  {/* Unread indicator */}
                  {Boolean(room.unreadCount && room.unreadCount > 0) && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {room.unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Right / Main Area: Conversation Box */}
      <div
        className={`flex-1 flex flex-col bg-white ${
          isMobileListOpen && activeRoomId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {currentRoom ? (
          <>
            {/* Chat Room Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setIsMobileListOpen(true)}
                  className="md:hidden p-1.5 -ml-1 text-slate-600 hover:bg-slate-100 rounded-xl"
                  title="대화 목록"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shadow-xs">
                  {currentRoom.participantName.slice(0, 1)}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-slate-800">
                      {currentRoom.participantName}
                    </h3>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {currentRoom.participantTag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    동업자 실시간 1:1 일정 및 업무 대화
                  </p>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onNavigateToCalendar()}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors flex items-center gap-1.5"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">캘린더 확인</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/30">
              {/* Privacy Notice */}
              <div className="text-center my-2">
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200/60">
                  {currentRoom.participantName}{currentRoom.participantTag}님과의 업무 전용 대화방입니다.
                </span>
              </div>

              {activeMessages.map((msg) => {
                const isMe = msg.senderId === 'me' || msg.senderName === userProfile.nickname;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[11px] font-bold text-slate-600">
                        {isMe ? userProfile.nickname : msg.senderName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isMe ? userProfile.tagId : msg.senderTag}
                      </span>
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-md rounded-2xl p-3.5 shadow-2xs text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-tr-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Embedded Schedule Invitation / Card if message contains schedule data */}
                      {msg.scheduleData && (
                        <div
                          className={`mt-2.5 p-3 rounded-xl border ${
                            isMe
                              ? 'bg-blue-700/80 border-blue-500 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold text-xs mb-1.5">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>{msg.scheduleData.title}</span>
                          </div>
                          <div className="text-[11px] opacity-90 space-y-0.5">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{msg.scheduleData.date} {msg.scheduleData.time}</span>
                            </div>
                            {msg.scheduleData.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{msg.scheduleData.location}</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => onNavigateToCalendar()}
                            className={`mt-2 w-full py-1 rounded-lg text-[11px] font-bold text-center transition-colors cursor-pointer ${
                              isMe
                                ? 'bg-white text-blue-700 hover:bg-blue-50'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            캘린더에서 보기
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick preset chips */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 shrink-0 mr-1">빠른 답장:</span>
              {QUICK_REPLIES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPreset(preset)}
                  className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200/60 transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`${currentRoom.participantName}님에게 메시지 전송...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-100 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="h-10 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">전송</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 stroke-1 text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">대화할 동업자를 선택해주세요</p>
            <p className="text-xs text-slate-400 mt-1">
              일정을 공유하거나 1:1 업무 대화를 나눌 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
