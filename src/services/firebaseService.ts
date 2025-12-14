import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { InterviewSession, UserProfile, JobRole, Difficulty, RoundType, InterviewQuestion, QuestionFeedback } from '@/types/interview';

// User operations
export async function createUserProfile(userId: string, email: string, name: string): Promise<UserProfile> {
  const userRef = doc(db, 'users', userId);
  const profile: Omit<UserProfile, 'createdAt'> & { createdAt: any } = {
    id: userId,
    email,
    name,
    totalInterviews: 0,
    averageScore: 0,
    streakDays: 0,
    badges: [],
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, profile);
  
  return {
    ...profile,
    createdAt: new Date(),
  };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  
  if (!snapshot.exists()) return null;
  
  const data = snapshot.data();
  return {
    ...data,
    id: snapshot.id,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
  } as UserProfile;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updates);
}

export async function updateUserStats(userId: string, newScore: number): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnapshot = await getDoc(userRef);
  
  if (!userSnapshot.exists()) return;
  
  const userData = userSnapshot.data();
  const totalInterviews = (userData.totalInterviews || 0) + 1;
  const currentTotal = (userData.averageScore || 0) * (userData.totalInterviews || 0);
  const newAverage = (currentTotal + newScore) / totalInterviews;
  
  await updateDoc(userRef, {
    totalInterviews,
    averageScore: Math.round(newAverage * 10) / 10,
  });
}

// Interview session operations
export interface FirestoreInterviewSession {
  id: string;
  userId: string;
  jobRole: JobRole;
  difficulty: Difficulty;
  roundType: RoundType;
  questions: InterviewQuestion[];
  answers: Record<string, string>;
  feedback: QuestionFeedback[];
  totalScore: number;
  resumeUsed: boolean;
  resumeContent?: string;
  createdAt: Date;
  completedAt?: Date;
}

export async function createInterviewSession(
  userId: string,
  jobRole: JobRole,
  difficulty: Difficulty,
  roundType: RoundType,
  questions: InterviewQuestion[],
  resumeContent?: string
): Promise<FirestoreInterviewSession> {
  const sessionData = {
    userId,
    jobRole,
    difficulty,
    roundType,
    questions,
    answers: {},
    feedback: [],
    totalScore: 0,
    resumeUsed: !!resumeContent,
    resumeContent: resumeContent || null,
    createdAt: serverTimestamp(),
    completedAt: null,
  };

  const docRef = await addDoc(collection(db, 'interviews'), sessionData);
  
  return {
    id: docRef.id,
    ...sessionData,
    createdAt: new Date(),
    completedAt: undefined,
  };
}

export async function updateInterviewSession(
  sessionId: string,
  updates: Partial<Omit<FirestoreInterviewSession, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const sessionRef = doc(db, 'interviews', sessionId);
  await updateDoc(sessionRef, updates);
}

export async function completeInterviewSession(
  sessionId: string,
  answers: Record<string, string>,
  feedback: QuestionFeedback[],
  totalScore: number
): Promise<void> {
  const sessionRef = doc(db, 'interviews', sessionId);
  await updateDoc(sessionRef, {
    answers,
    feedback,
    totalScore,
    completedAt: serverTimestamp(),
  });
}

export async function getUserInterviews(userId: string): Promise<FirestoreInterviewSession[]> {
  const q = query(
    collection(db, 'interviews'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate() : data.completedAt ? new Date(data.completedAt) : undefined,
    } as FirestoreInterviewSession;
  });
}

export async function getInterviewSession(sessionId: string): Promise<FirestoreInterviewSession | null> {
  const sessionRef = doc(db, 'interviews', sessionId);
  const snapshot = await getDoc(sessionRef);
  
  if (!snapshot.exists()) return null;
  
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate() : data.completedAt ? new Date(data.completedAt) : undefined,
  } as FirestoreInterviewSession;
}

// Analytics
export interface UserAnalytics {
  totalSessions: number;
  averageScore: number;
  scoreHistory: { date: string; score: number }[];
  skillBreakdown: { skill: string; score: number }[];
  rolePerformance: { role: JobRole; sessions: number; avgScore: number }[];
  improvementAreas: string[];
}

export async function getUserAnalytics(userId: string): Promise<UserAnalytics> {
  const interviews = await getUserInterviews(userId);
  const completedInterviews = interviews.filter(i => i.completedAt);
  
  if (completedInterviews.length === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      scoreHistory: [],
      skillBreakdown: [],
      rolePerformance: [],
      improvementAreas: [],
    };
  }

  // Calculate score history (last 10 sessions)
  const scoreHistory = completedInterviews
    .slice(0, 10)
    .reverse()
    .map(interview => ({
      date: interview.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: interview.totalScore,
    }));

  // Calculate skill breakdown from feedback
  const allFeedback = completedInterviews.flatMap(i => i.feedback);
  const skillBreakdown = [
    { skill: 'Clarity', score: Math.round(allFeedback.reduce((acc, f) => acc + f.clarity, 0) / allFeedback.length) || 0 },
    { skill: 'Relevance', score: Math.round(allFeedback.reduce((acc, f) => acc + f.relevance, 0) / allFeedback.length) || 0 },
    { skill: 'Technical', score: Math.round(allFeedback.reduce((acc, f) => acc + (f.technicalAccuracy || 0), 0) / allFeedback.length) || 0 },
    { skill: 'Communication', score: Math.round(allFeedback.reduce((acc, f) => acc + f.communication, 0) / allFeedback.length) || 0 },
  ];

  // Calculate role performance
  const roleGroups = completedInterviews.reduce((acc, interview) => {
    if (!acc[interview.jobRole]) {
      acc[interview.jobRole] = { sessions: 0, totalScore: 0 };
    }
    acc[interview.jobRole].sessions++;
    acc[interview.jobRole].totalScore += interview.totalScore;
    return acc;
  }, {} as Record<JobRole, { sessions: number; totalScore: number }>);

  const rolePerformance = Object.entries(roleGroups).map(([role, data]) => ({
    role: role as JobRole,
    sessions: data.sessions,
    avgScore: Math.round((data.totalScore / data.sessions) * 10) / 10,
  }));

  // Find improvement areas (skills below 7)
  const improvementAreas = skillBreakdown
    .filter(s => s.score < 7)
    .map(s => s.skill);

  return {
    totalSessions: completedInterviews.length,
    averageScore: Math.round(completedInterviews.reduce((acc, i) => acc + i.totalScore, 0) / completedInterviews.length * 10) / 10,
    scoreHistory,
    skillBreakdown,
    rolePerformance,
    improvementAreas,
  };
}
