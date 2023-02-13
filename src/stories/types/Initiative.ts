
export interface Initiative {
  unit: number;
  unitTitle: string;
  title: string;
  organizationType?: string;
  progress?: number;
  status?: string;
  owner?: {
    avatarUrl?: string;
    fullName: string;
  };
}
