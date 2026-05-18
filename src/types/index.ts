export interface Warranty {
  id: string;
  title: string;
  category: string;
  purchaseDate: string;
  durationMonths: number;
  description?: string;
  fileIds: string[]; // Google Drive file IDs for receipts/photos
  tags: string[];
  createdAt: string;
}

export interface Database {
  warranties: Warranty[];
  version: string;
  lastUpdated: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture: string;
}
