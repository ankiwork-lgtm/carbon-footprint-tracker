// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  carbonScore: number;
  baselineEmissions: number;
  reductionGoalPercentage: number;
  goalDeadline?: string;
  country?: string;
  city?: string;
  householdSize?: number;
}

// Activity Types
export type ActivityCategory = 'transport' | 'food' | 'energy' | 'shopping';

export interface Activity {
  id: string;
  userId: string;
  category: ActivityCategory;
  activityType: string;
  amount: number;
  unit: string;
  emissionsKg: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ActivitySummary {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  totalEmissions: number;
  averageDaily: number;
  breakdown: {
    transport: number;
    food: number;
    energy: number;
    shopping: number;
  };
  comparedToBaseline?: {
    difference: number;
    percentageChange: number;
  };
}

// Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  type: 'select' | 'number' | 'radio';
  options?: string[];
  category: ActivityCategory;
}

export interface QuizResponse {
  questionId: string;
  answer: string | number;
}

export interface QuizResult {
  carbonScore: number;
  baselineEmissions: number;
  breakdown: {
    transport: number;
    food: number;
    energy: number;
    shopping: number;
  };
  comparison: {
    nationalAverage: number;
    percentile: number;
  };
  recommendations: string[];
}

// Dashboard Types
export interface DashboardSummary {
  carbonScore: number;
  scoreChange: number;
  todayEmissions: number;
  todayTarget: number;
  weeklyEmissions: number;
  monthlyEmissions: number;
  goal: {
    reductionPercentage: number;
    currentProgress: number;
    daysRemaining: number;
    onTrack: boolean;
  };
  breakdown: {
    transport: number;
    food: number;
    energy: number;
    shopping: number;
  };
  recentAchievements: Achievement[];
}

export interface TrendDataPoint {
  date: string;
  emissions: number;
  target: number;
}

// Insights Types
export type InsightType = 'pattern' | 'suggestion' | 'celebration' | 'warning';

export interface Insight {
  id: string;
  userId: string;
  type: InsightType;
  title: string;
  description: string;
  priority: number;
  isRead: boolean;
  createdAt: string;
}

// Challenge Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  durationDays: number;
  targetReductionKg: number;
  badgeIcon: string;
  isActive: boolean;
  enrollmentCount?: number;
}

export type ChallengeStatus = 'available' | 'active' | 'completed' | 'failed';

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  challenge?: Challenge;
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
  progress: number;
  emissionsSaved: number;
  daysRemaining?: number;
  currentStreak?: number;
}

// Achievement Types
export interface Achievement {
  id: string;
  userId: string;
  badgeType: string;
  badgeName: string;
  badgeIcon: string;
  description: string;
  earnedAt: string;
}

// Community Types
export type PostType = 'win' | 'tip' | 'story';

export interface CommunityPost {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  content: string;
  postType: PostType;
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  name: string;
}

export interface ActivityFormData {
  category: ActivityCategory;
  activityType: string;
  amount: number;
  unit: string;
  date: string;
  notes?: string;
}

export interface GoalFormData {
  reductionPercentage: number;
  deadline: string;
}

export interface ProfileFormData {
  name: string;
  city?: string;
  householdSize?: number;
}

// Made with Bob
