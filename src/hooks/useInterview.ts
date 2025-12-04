import { useState, useCallback } from 'react';
import { 
  InterviewSession, 
  InterviewQuestion, 
  QuestionFeedback,
  JobRole, 
  Difficulty, 
  RoundType 
} from '@/types/interview';
import { generateMockQuestions, generateMockFeedback } from '@/lib/mockData';

interface UseInterviewReturn {
  session: InterviewSession | null;
  currentQuestionIndex: number;
  isLoading: boolean;
  startInterview: (config: InterviewConfig) => Promise<void>;
  submitAnswer: (answer: string) => Promise<QuestionFeedback>;
  nextQuestion: () => void;
  endInterview: () => InterviewSession;
  currentQuestion: InterviewQuestion | null;
  progress: number;
}

interface InterviewConfig {
  jobRole: JobRole;
  difficulty: Difficulty;
  roundType: RoundType;
  questionCount: number;
}

export function useInterview(): UseInterviewReturn {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const startInterview = useCallback(async (config: InterviewConfig) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const questions = generateMockQuestions(config.jobRole, config.roundType, config.questionCount);
    
    const newSession: InterviewSession = {
      id: crypto.randomUUID(),
      userId: 'demo-user',
      jobRole: config.jobRole,
      difficulty: config.difficulty,
      roundType: config.roundType,
      questions,
      answers: {},
      feedback: [],
      totalScore: 0,
      createdAt: new Date(),
    };
    
    setSession(newSession);
    setCurrentQuestionIndex(0);
    setIsLoading(false);
  }, []);

  const submitAnswer = useCallback(async (answer: string): Promise<QuestionFeedback> => {
    if (!session) throw new Error('No active session');
    
    setIsLoading(true);
    
    // Simulate AI evaluation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const currentQuestion = session.questions[currentQuestionIndex];
    const feedback = generateMockFeedback(currentQuestion.id, answer);
    
    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        answers: { ...prev.answers, [currentQuestion.id]: answer },
        feedback: [...prev.feedback, feedback],
      };
    });
    
    setIsLoading(false);
    return feedback;
  }, [session, currentQuestionIndex]);

  const nextQuestion = useCallback(() => {
    if (session && currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [session, currentQuestionIndex]);

  const endInterview = useCallback((): InterviewSession => {
    if (!session) throw new Error('No active session');
    
    const totalScore = session.feedback.length > 0
      ? Math.round(session.feedback.reduce((acc, f) => acc + f.score, 0) / session.feedback.length)
      : 0;
    
    const completedSession: InterviewSession = {
      ...session,
      totalScore,
      completedAt: new Date(),
    };
    
    // Store in localStorage for demo
    const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
    history.push(completedSession);
    localStorage.setItem('interviewHistory', JSON.stringify(history));
    
    return completedSession;
  }, [session]);

  const currentQuestion = session?.questions[currentQuestionIndex] || null;
  const progress = session ? ((currentQuestionIndex + 1) / session.questions.length) * 100 : 0;

  return {
    session,
    currentQuestionIndex,
    isLoading,
    startInterview,
    submitAnswer,
    nextQuestion,
    endInterview,
    currentQuestion,
    progress,
  };
}
