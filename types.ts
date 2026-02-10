
export interface Testimonial {
  id: number;
  content: string;
  author: string;
}

export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export type ApplicationIntent = 'life' | 'romance' | null;

export interface FormData {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  calendarType: 'solar' | 'lunar' | 'leap-lunar';
  intent: ApplicationIntent;
}
