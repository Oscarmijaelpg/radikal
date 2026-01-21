export type ScreenName = 
  | 'landing'
  | 'login' 
  | 'register'
  | 'onboarding'
  | 'dashboard' 
  | 'brand' 
  | 'radar' 
  | 'radar-scanning'
  | 'radar-results'
  | 'generation' 
  | 'scanning' 
  | 'results'
  | 'profile';

export interface User {
  name: string;
  role: string;
  avatar: string;
  company: string;
}

export interface NavItem {
  id: ScreenName;
  label: string;
  icon: string;
}

export interface InsightCardProps {
  type: 'insight' | 'sentiment';
  text: string;
  icon: string;
}
