import { InterviewQuestion, QuestionFeedback, JobRole, RoundType, AnalyticsData } from '@/types/interview';

const technicalQuestions: Record<JobRole, string[]> = {
  'software-engineer': [
    'Explain the difference between REST and GraphQL APIs.',
    'How would you optimize a slow database query?',
    'Describe your approach to code reviews.',
    'What is the difference between SQL and NoSQL databases?',
    'Explain the concept of microservices architecture.',
    'How do you handle error handling in your applications?',
    'What testing strategies do you use in your projects?',
    'Explain the concept of CI/CD pipelines.',
  ],
  'data-analyst': [
    'How would you handle missing data in a dataset?',
    'Explain the difference between correlation and causation.',
    'What visualization would you use to show trends over time?',
    'How do you validate the accuracy of your analysis?',
    'Explain the concept of A/B testing.',
    'What is the difference between supervised and unsupervised learning?',
    'How do you present complex data findings to non-technical stakeholders?',
    'What tools do you use for data cleaning?',
  ],
  'product-manager': [
    'How do you prioritize features in a product backlog?',
    'Describe your process for gathering user requirements.',
    'How do you measure product success?',
    'How do you handle conflicting stakeholder requirements?',
    'Explain your approach to product roadmapping.',
    'How do you validate product ideas before development?',
    'What metrics do you track for product performance?',
    'How do you handle feature requests from customers?',
  ],
  'hr-manager': [
    'How do you handle conflict resolution in the workplace?',
    'Describe your approach to employee retention.',
    'How do you measure employee engagement?',
    'What strategies do you use for diversity and inclusion?',
    'How do you handle underperforming employees?',
    'Describe your onboarding process for new hires.',
    'How do you stay updated with employment laws?',
    'What tools do you use for HR analytics?',
  ],
  'marketing-manager': [
    'How do you measure ROI on marketing campaigns?',
    'Describe your approach to content marketing.',
    'How do you identify target audiences?',
    'What channels do you prioritize for B2B vs B2C?',
    'How do you handle a crisis in brand reputation?',
    'Describe your experience with marketing automation.',
    'How do you balance brand awareness and lead generation?',
    'What metrics do you track for campaign success?',
  ],
  'sales-representative': [
    'How do you handle objections from prospects?',
    'Describe your sales process from lead to close.',
    'How do you prioritize your sales pipeline?',
    'What strategies do you use for cold outreach?',
    'How do you maintain relationships with existing customers?',
    'Describe a time you lost a deal and what you learned.',
    'How do you stay motivated during slow periods?',
    'What CRM tools have you used?',
  ],
  'ux-designer': [
    'How do you conduct user research?',
    'Describe your design process from concept to delivery.',
    'How do you handle design feedback from stakeholders?',
    'What tools do you use for prototyping?',
    'How do you ensure accessibility in your designs?',
    'Describe how you prioritize user needs vs business goals.',
    'How do you measure the success of a design?',
    'What is your approach to design systems?',
  ],
  'devops-engineer': [
    'Explain the concept of Infrastructure as Code.',
    'How do you handle incident management?',
    'Describe your monitoring and alerting strategy.',
    'What container orchestration tools have you used?',
    'How do you ensure security in CI/CD pipelines?',
    'Explain blue-green deployment strategy.',
    'How do you handle secrets management?',
    'What is your approach to disaster recovery?',
  ],
};

const behavioralQuestions = [
  'Tell me about a time you faced a difficult challenge at work.',
  'Describe a situation where you had to work with a difficult team member.',
  'Give an example of a time you showed leadership.',
  'Tell me about a time you failed and what you learned.',
  'Describe a situation where you had to meet a tight deadline.',
  'Give an example of when you went above and beyond.',
  'Tell me about a time you had to adapt to change quickly.',
  'Describe a situation where you had to make a difficult decision.',
];

const situationalQuestions = [
  'How would you handle a project that is falling behind schedule?',
  'What would you do if you disagreed with your manager\'s decision?',
  'How would you approach learning a new skill quickly?',
  'What would you do if a team member was not pulling their weight?',
  'How would you handle multiple competing priorities?',
  'What would you do if you made a mistake that affected the team?',
  'How would you approach a task you\'ve never done before?',
  'What would you do if you received negative feedback?',
];

export function generateMockQuestions(
  role: JobRole, 
  roundType: RoundType, 
  count: number
): InterviewQuestion[] {
  let questionPool: string[] = [];
  
  switch (roundType) {
    case 'technical':
      questionPool = technicalQuestions[role];
      break;
    case 'behavioral':
      questionPool = behavioralQuestions;
      break;
    case 'situational':
      questionPool = situationalQuestions;
      break;
    case 'mixed':
      questionPool = [
        ...technicalQuestions[role].slice(0, 3),
        ...behavioralQuestions.slice(0, 3),
        ...situationalQuestions.slice(0, 3),
      ];
      break;
  }
  
  // Shuffle and pick questions
  const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  
  return selected.map((question, index) => ({
    id: `q-${index + 1}`,
    question,
    type: roundType === 'mixed' 
      ? index < 3 ? 'technical' : index < 6 ? 'behavioral' : 'situational'
      : roundType,
    answerMode: Math.random() > 0.5 ? 'voice' : 'text',
  }));
}

export function generateMockFeedback(questionId: string, answer: string): QuestionFeedback {
  const baseScore = Math.min(10, Math.max(3, Math.floor(answer.length / 50) + Math.random() * 3));
  
  const strengths = [
    'Clear and structured response',
    'Good use of specific examples',
    'Demonstrated relevant experience',
    'Strong communication skills',
    'Showed problem-solving ability',
  ].sort(() => Math.random() - 0.5).slice(0, 2);
  
  const weaknesses = [
    'Could provide more specific details',
    'Consider using the STAR format more',
    'Add quantifiable results when possible',
    'Expand on the impact of your actions',
    'Include lessons learned',
  ].sort(() => Math.random() - 0.5).slice(0, 2);
  
  const improvements = [
    'Practice structuring answers with clear beginning, middle, and end',
    'Prepare more specific examples from your experience',
    'Focus on quantifying your achievements',
    'Work on conciseness while maintaining detail',
    'Practice speaking at a measured pace',
  ].sort(() => Math.random() - 0.5).slice(0, 2);
  
  return {
    questionId,
    score: Math.round(baseScore),
    clarity: Math.round(baseScore + (Math.random() - 0.5) * 2),
    relevance: Math.round(baseScore + (Math.random() - 0.5) * 2),
    technicalAccuracy: Math.round(baseScore + (Math.random() - 0.5) * 2),
    communication: Math.round(baseScore + (Math.random() - 0.5) * 2),
    strengths,
    weaknesses,
    improvements,
  };
}

export function generateMockAnalytics(): AnalyticsData {
  const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
  
  if (history.length === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      scoreHistory: [],
      skillBreakdown: [
        { skill: 'Communication', score: 0 },
        { skill: 'Technical Knowledge', score: 0 },
        { skill: 'Problem Solving', score: 0 },
        { skill: 'Leadership', score: 0 },
        { skill: 'Adaptability', score: 0 },
      ],
      rolePerformance: [],
      improvementAreas: [],
    };
  }
  
  const totalSessions = history.length;
  const averageScore = Math.round(
    history.reduce((acc: number, s: any) => acc + s.totalScore, 0) / totalSessions
  );
  
  return {
    totalSessions,
    averageScore,
    scoreHistory: history.map((s: any, i: number) => ({
      date: new Date(s.createdAt).toLocaleDateString(),
      score: s.totalScore,
    })),
    skillBreakdown: [
      { skill: 'Communication', score: Math.round(averageScore + (Math.random() - 0.5) * 10) },
      { skill: 'Technical Knowledge', score: Math.round(averageScore + (Math.random() - 0.5) * 10) },
      { skill: 'Problem Solving', score: Math.round(averageScore + (Math.random() - 0.5) * 10) },
      { skill: 'Leadership', score: Math.round(averageScore + (Math.random() - 0.5) * 10) },
      { skill: 'Adaptability', score: Math.round(averageScore + (Math.random() - 0.5) * 10) },
    ],
    rolePerformance: [],
    improvementAreas: ['Provide more specific examples', 'Work on time management', 'Practice STAR format'],
  };
}
