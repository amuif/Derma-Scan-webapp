export interface Scan {
  id: string;
  userId: string;
  imageUrl: string;
  imageQuality: string;
  confidence: number;
  conditions: string[];
  risk: "HIGH" | "LOW" | "MEDIUM";
  notes: string;
  timestamp: string;
  user: User;
}

export interface ScanCondition {
  id: string;
  scanId: string;
  conditionId: string;
  scan: Scan;
  condition: Condition;
  confidence: number;
}
export interface Condition {
  id: string;
  name: string[];
  description: string;
  scans: ScanCondition[];
}
