import { ScheduleItem, TodoItem, MemoItem } from '../types';

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTomorrowDateString = (): string => {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getInitialSchedules = (): ScheduleItem[] => {
  const today = getTodayDateString();
  return [
    {
      id: 'sch-1',
      title: '팀 주간 스프린트 미팅',
      date: today,
      startTime: '09:30',
      endTime: '10:30',
      location: '대회의실 2층 / Google Meet',
      notes: '이번 주 주요 배포 마일스톤 및 이슈 점검',
      color: 'blue'
    },
    {
      id: 'sch-2',
      title: '클라이언트 파트너십 제안서 리뷰',
      date: today,
      startTime: '13:30',
      endTime: '14:30',
      location: '고객사 본사 8층 회의실',
      notes: '피드백 반영된 최종 기획안 프리젠테이션',
      color: 'amber'
    },
    {
      id: 'sch-3',
      title: 'UI/UX 디자인 시스템 개편 싱크',
      date: today,
      startTime: '16:00',
      endTime: '17:00',
      location: '디자인팀 라운지',
      notes: '신규 모바일 카드 컴포넌트 검토 및 가이드 확정',
      color: 'purple'
    }
  ];
};

export const getInitialTodos = (): TodoItem[] => {
  const today = getTodayDateString();
  const tomorrow = getTomorrowDateString();
  return [
    {
      id: 'todo-1',
      title: '3분기 업무 실적 보고서 최종안 작성',
      dueDate: today,
      priority: 'high',
      completed: false,
      notes: '지표 차트 및 팀별 코멘트 취합 필요'
    },
    {
      id: 'todo-2',
      title: '외부 협력사 정산서 확인 및 전자결재',
      dueDate: today,
      priority: 'medium',
      completed: true,
      notes: '재무팀 전달 완료'
    },
    {
      id: 'todo-3',
      title: '신규 프로젝트 와이어프레임 초안 검토',
      dueDate: tomorrow,
      priority: 'medium',
      completed: false,
      notes: '피그마 댓글 남기기'
    },
    {
      id: 'todo-4',
      title: '주간 업무 일지 작성 및 제출',
      dueDate: tomorrow,
      priority: 'low',
      completed: false,
      notes: '금요일 오후 5시 이전 제출'
    }
  ];
};

export const getInitialMemos = (): MemoItem[] => {
  const today = getTodayDateString();
  return [
    {
      id: 'memo-1',
      title: '2026 하반기 팀 핵심 슬로건 & 목표',
      content: '1. 업무 자동화로 단순 반복 작업 30% 감축\n2. 사용자 피드백 반영 주기 1주일 이내로 단축\n3. 상호 존중과 명확한 비동기 커뮤니케이션 문화 정착',
      createdAt: today,
      color: 'yellow',
      category: '아이디어',
      sticker: 'star',
      pinned: true
    },
    {
      id: 'memo-2',
      title: '업무 효율화를 위한 도구 정리',
      content: '- 회의록 정리 템플릿 표준화하기\n- 노션 대시보드 주간 일정 동기화\n- 중요도 높은 일은 오전에 몰입하여 끝내기 (뽀모도로 기법 추천)',
      createdAt: today,
      color: 'blue',
      category: '업무',
      sticker: 'thankyou',
      pinned: false
    },
    {
      id: 'memo-3',
      title: '커피챗 미팅 아이디어 메모',
      content: '다음 주 신규 입사자 분과 편안한 캐주얼 티타임 예정. 온보딩 과정에서 겪은 개선점 경청하기.',
      createdAt: today,
      color: 'pink',
      category: '개인',
      sticker: 'flower',
      pinned: false
    }
  ];
};

