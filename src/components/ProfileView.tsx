import React, { useState, useRef } from 'react';
import {
  User,
  Copy,
  Check,
  Edit3,
  MessageSquare,
  UserPlus,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileText,
  RotateCcw,
  X,
  Smile,
  ShieldCheck,
  RefreshCw,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { UserProfile, Friend, TodoItem, ScheduleItem, MemoItem } from '../types';
import { generateTagId } from '../utils/storage';
import { 
  StarCharacter, 
  CloudCharacter, 
  PencilBlob, 
  EggCharacter, 
  OrangeBlobCharacter,
  PentagonCharacter 
} from './Characters';
import avatar1 from '../assets/images/profile_avatar_user_1789386830218.jpg';
import avatar2 from '../assets/images/profile_avatar_two_1789386843384.jpg';

interface ProfileViewProps {
  profile: UserProfile;
  friends: Friend[];
  onUpdateProfile: (updated: UserProfile) => void;
  onAddFriend: (tagInput: string) => boolean;
  onOpenChatWithFriend: (friendTagOrName: string) => void;
  onResetProfile: () => void;
  todos: TodoItem[];
  schedules: ScheduleItem[];
  memos: MemoItem[];
  onShowToast: (message: string) => void;
}

const STATUS_QUICK_OPTIONS = [
  '회의 중 (~16:00)',
  '집중 업무 중',
  '외근 및 미팅',
  '재택근무 중',
  '자리 비움 (식사/휴식)',
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  friends,
  onUpdateProfile,
  onAddFriend,
  onOpenChatWithFriend,
  onResetProfile,
  todos,
  schedules,
  memos,
  onShowToast,
}) => {
  // File input ref for user photo upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);

  // Edit Profile modal inputs (Strictly: Nickname & Bio only)
  const [editNickname, setEditNickname] = useState(profile.nickname);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatar, setEditAvatar] = useState(profile.avatarUrl || 'avatar-1');
  const [tempTagId, setTempTagId] = useState(profile.tagId || '#4829');

  // Status message modal input
  const [newStatusMessage, setNewStatusMessage] = useState(profile.statusMessage);

  // Friend add input
  const [friendTagInput, setFriendTagInput] = useState('');
  const [addFriendError, setAddFriendError] = useState('');

  // Copied tag feedback
  const [copiedTag, setCopiedTag] = useState(false);

  // Statistics
  const completedTodosCount = todos.filter((t) => t.completed).length;
  const activeSchedulesCount = schedules.length;
  const totalMemosCount = memos.length;

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onShowToast('사진 용량은 5MB 이하만 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setEditAvatar(dataUrl);
      
      // If modal is not open, save directly to profile
      if (!isEditModalOpen) {
        onUpdateProfile({
          ...profile,
          avatarUrl: dataUrl,
        });
      }
      onShowToast('프로필 사진이 업로드되었습니다.');
    };
    reader.onerror = () => {
      onShowToast('사진을 불러오는데 실패했습니다.');
    };
    reader.readAsDataURL(file);
  };

  const handleCopyTag = () => {
    const full = `${profile.nickname}${profile.tagId}`;
    navigator.clipboard.writeText(full);
    setCopiedTag(true);
    onShowToast(`식별코드 "${full}"가 복사되었습니다.`);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  const handleOpenEditModal = () => {
    setEditNickname(profile.nickname);
    setEditBio(profile.bio);
    setEditAvatar(profile.avatarUrl || 'avatar-1');
    setTempTagId(profile.tagId || generateTagId());
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNickname.trim()) {
      onShowToast('닉네임을 입력해주세요.');
      return;
    }

    const updatedTagId = tempTagId || generateTagId();
    const updated: UserProfile = {
      ...profile,
      nickname: editNickname.trim(),
      tagId: updatedTagId,
      fullTag: `${editNickname.trim()}${updatedTagId}`,
      bio: editBio.trim(),
      avatarUrl: editAvatar,
    };

    onUpdateProfile(updated);
    setIsEditModalOpen(false);
    onShowToast('프로필이 저장되었습니다.');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      statusMessage: newStatusMessage.trim(),
      statusUpdatedAt: undefined,
    });
    setIsStatusModalOpen(false);
    onShowToast('상태 메시지가 업데이트되었습니다.');
  };


  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddFriendError('');
    if (!friendTagInput.trim()) return;

    const success = onAddFriend(friendTagInput.trim());
    if (success) {
      setFriendTagInput('');
      setIsAddFriendModalOpen(false);
      onShowToast('동업자가 추가되었습니다.');
    } else {
      setAddFriendError('올바른 형식(예: 닉네임#1234)으로 입력해주세요.');
    }
  };

  const renderAvatarGraphic = (avatarKey: string, sizeClass = 'w-20 h-20') => {
    // Custom uploaded user photo (Base64 data URL or HTTP URL)
    if (avatarKey && (avatarKey.startsWith('data:') || avatarKey.startsWith('http') || avatarKey.startsWith('blob:'))) {
      return (
        <img
          src={avatarKey}
          alt="My Photo"
          className={`${sizeClass} rounded-2xl object-cover border-2 border-purple-200 shadow-xs ring-2 ring-purple-100`}
        />
      );
    }

    switch (avatarKey) {
      case 'char-star':
        return (
          <div className={`${sizeClass} rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-200 overflow-hidden shadow-xs`}>
            <StarCharacter size={52} />
          </div>
        );
      case 'char-cloud':
        return (
          <div className={`${sizeClass} rounded-2xl bg-sky-50 flex items-center justify-center border border-sky-200 overflow-hidden shadow-xs`}>
            <CloudCharacter size={56} />
          </div>
        );
      case 'char-pencil':
        return (
          <div className={`${sizeClass} rounded-2xl bg-pink-50 flex items-center justify-center border border-pink-200 overflow-hidden shadow-xs`}>
            <PencilBlob size={50} />
          </div>
        );
      case 'char-egg':
        return (
          <div className={`${sizeClass} rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-200 overflow-hidden shadow-xs`}>
            <EggCharacter size={50} />
          </div>
        );
      case 'char-orange':
        return (
          <div className={`${sizeClass} rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-200 overflow-hidden shadow-xs`}>
            <OrangeBlobCharacter size={42} />
          </div>
        );
      case 'avatar-2':
        return (
          <img
            src={avatar2}
            alt="Avatar"
            className={`${sizeClass} rounded-2xl object-cover border border-slate-200 shadow-xs`}
          />
        );
      case 'avatar-1':
      default:
        return (
          <img
            src={avatar1}
            alt="Avatar"
            className={`${sizeClass} rounded-2xl object-cover border border-slate-200 shadow-xs`}
          />
        );
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Hidden File Input for Custom Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* 1. MAIN PROFILE CARD */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-50/50 to-indigo-50/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          {/* Avatar & User Details */}
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {renderAvatarGraphic(profile.avatarUrl || 'avatar-1', 'w-20 h-20 sm:w-24 sm:h-24')}
              
              {/* Photo Upload Overlay Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute -bottom-1 -right-1 p-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl shadow-md transition-colors cursor-pointer"
                title="내 사진 업로드"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              {/* Nickname & Discord-style Tag */}
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  {profile.nickname}
                </h2>
                <div className="inline-flex items-center gap-1 bg-purple-50 hover:bg-purple-100/80 px-2.5 py-1 rounded-xl transition-colors">
                  <span className="text-xs font-black text-purple-700 tracking-wider">
                    {profile.tagId}
                  </span>
                  <button
                    onClick={handleCopyTag}
                    className="text-slate-400 hover:text-purple-700 cursor-pointer p-0.5"
                    title="식별코드 복사"
                  >
                    {copiedTag ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bio (One-liner) */}
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 line-clamp-2 max-w-md">
                {profile.bio || '한 줄 소개가 없습니다.'}
              </p>

              {/* Photo Upload Quick Hint */}
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                >
                  <Camera className="w-3 h-3" />
                  <span>사진 변경</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Edit Profile Button - Icon Only as requested */}
          <button
            onClick={handleOpenEditModal}
            className="p-2.5 bg-slate-100 hover:bg-purple-50 hover:text-[#7C3AED] text-slate-600 rounded-2xl transition-colors cursor-pointer border border-slate-200/80 shadow-2xs shrink-0 self-start sm:self-center"
            title="프로필 설정"
            aria-label="프로필 설정"
          >
            <Edit3 className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Status Message Strip - No time display as requested */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 p-3.5 rounded-2xl">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-[11px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-md shrink-0">
              상태 메시지
            </span>
            <span className="text-xs font-medium text-slate-700 truncate">
              {profile.statusMessage || '설정된 상태가 없습니다.'}
            </span>
          </div>

          <button
            onClick={() => {
              setNewStatusMessage(profile.statusMessage);
              setIsStatusModalOpen(true);
            }}
            className="self-end sm:self-center text-xs text-purple-700 hover:text-purple-800 font-bold hover:underline shrink-0 cursor-pointer"
          >
            상태 변경
          </button>
        </div>
      </div>


      {/* 2. WORK STATISTICS SUMMARY */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-500 font-medium">오늘 일정</span>
          <span className="text-lg font-black text-slate-800">{activeSchedulesCount}개</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-500 font-medium">완료한 할 일</span>
          <span className="text-lg font-black text-purple-600">{completedTodosCount}개</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-500 font-medium">작성한 메모</span>
          <span className="text-lg font-black text-amber-600">{totalMemosCount}개</span>
        </div>
      </div>

      {/* 3. FRIENDS / PARTNERS LIST */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5">
              동업자 목록
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {friends.length}명
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              일정을 공유하고 1:1 대화를 진행할 수 있는 동업자입니다.
            </p>
          </div>

          <button
            onClick={() => setIsAddFriendModalOpen(true)}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl border border-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>동업자 추가</span>
          </button>
        </div>

        {friends.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-500">등록된 동업자가 없습니다.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              식별코드(#숫자4자리)로 동업자를 추가해보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 border border-indigo-200">
                    {friend.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-800 truncate">
                        {friend.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {friend.tag}
                      </span>
                    </div>
                    {friend.statusMessage && (
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {friend.statusMessage}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onOpenChatWithFriend(friend.fullTag || `${friend.name}${friend.tag}`)}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shrink-0 transition-colors shadow-2xs cursor-pointer"
                  title="1:1 대화하기"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>채팅</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. MODAL: EDIT PROFILE (Strictly Nickname & Bio Only) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-800">프로필 설정</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector with Photo Upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600">
                    프로필 사진 / 캐릭터
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>내 사진 올리기</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {/* Option: Uploaded Photo */}
                  {editAvatar && (editAvatar.startsWith('data:') || editAvatar.startsWith('http') || editAvatar.startsWith('blob:')) && (
                    <button
                      type="button"
                      onClick={() => {}}
                      className="p-1 rounded-xl border-2 border-purple-600 bg-purple-50/50 shadow-xs flex flex-col items-center justify-center gap-1"
                    >
                      <img src={editAvatar} alt="Uploaded" className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-[10px] font-bold text-purple-700">내 사진</span>
                    </button>
                  )}

                  {[
                    { key: 'avatar-1', label: '기본 1' },
                    { key: 'avatar-2', label: '기본 2' },
                    { key: 'char-star', label: '별이' },
                    { key: 'char-cloud', label: '구름이' },
                    { key: 'char-pencil', label: '연필이' },
                    { key: 'char-egg', label: '달걀이' },
                    { key: 'char-orange', label: '오렌지' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setEditAvatar(item.key)}
                      className={`p-1.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        editAvatar === item.key
                          ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                          : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                      }`}
                    >
                      {renderAvatarGraphic(item.key, 'w-8 h-8')}
                      <span className="text-[10px] font-medium text-slate-500">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>


              {/* Nickname & Auto-generated Tag */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  닉네임
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    placeholder="닉네임 입력"
                    maxLength={15}
                    required
                    className="flex-1 bg-slate-100 text-sm font-bold text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {/* Tag display + Refresh code */}
                  <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-black text-blue-600 shrink-0">
                    <span>{tempTagId}</span>
                    <button
                      type="button"
                      onClick={() => setTempTagId(generateTagId())}
                      className="text-slate-400 hover:text-slate-600 ml-1 p-0.5"
                      title="태그 번호 새로고침"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  공유 및 식별용 고유 식별코드: {editNickname || '닉네임'}{tempTagId}
                </p>
              </div>

              {/* Bio (One-liner) */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  자기소개 (한 줄 소개)
                </label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="자신을 소개하는 간단한 한 줄을 적어주세요."
                  maxLength={60}
                  className="w-full bg-slate-100 text-xs sm:text-sm text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: STATUS MESSAGE EDIT */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3.5">
              <h3 className="text-sm font-black text-slate-800">상태 메시지 설정</h3>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-3">
              <input
                type="text"
                value={newStatusMessage}
                onChange={(e) => setNewStatusMessage(e.target.value)}
                placeholder="현재 상태 입력 (예: 회의 중, 집중 근무)"
                maxLength={40}
                className="w-full bg-slate-100 text-xs sm:text-sm text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />

              {/* Preset chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {STATUS_QUICK_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setNewStatusMessage(opt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200/80 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: ADD FRIEND / PARTNER */}
      {isAddFriendModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3.5">
              <h3 className="text-sm font-black text-slate-800">동업자 추가</h3>
              <button
                onClick={() => setIsAddFriendModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFriendSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  동업자 태그 코드 입력
                </label>
                <input
                  type="text"
                  value={friendTagInput}
                  onChange={(e) => {
                    setFriendTagInput(e.target.value);
                    setAddFriendError('');
                  }}
                  placeholder="예: 이지민#3190"
                  className="w-full bg-slate-100 text-sm text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {addFriendError && (
                  <p className="text-[11px] text-rose-500 font-bold mt-1">
                    {addFriendError}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  상대방의 닉네임과 #숫자 4자리를 함께 입력해주세요.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFriendModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
