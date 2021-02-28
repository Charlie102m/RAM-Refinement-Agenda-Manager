export interface Agenda {
  id: number;
  date: Date | null;
  workItems?: WorkItem[];
}

export interface WorkItem {
  id: number | string;
  title: string;
  category?: string;
  storyPoints?: number;
  state?: string;
  link?: string;
}

export type Token = string;
