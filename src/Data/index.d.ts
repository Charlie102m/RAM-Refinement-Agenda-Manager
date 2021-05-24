export interface Agenda {
  id: string;
  date: Date;
  workItems: WorkItem[];
}

export interface WorkItem {
  id: number;
  title: string;
  category?: string;
  storyPoints?: number;
  state?: string;
  link: string;
}

export type Token = string;

export type BaseUrl = string;
