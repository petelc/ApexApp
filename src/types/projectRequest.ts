/**
 * ProjectRequest Types
 */

export type ProjectRequestStatus =
  | 'Draft'
  | 'Pending'
  | 'InReview'
  | 'Approved'
  | 'Denied'
  | 'Cancelled'
  | 'Converted';

export type RequestPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ProjectRequest {
  id: string;
  title: string;
  description: string;
  businessJustification: string;
  status: ProjectRequestStatus;
  priority: RequestPriority;
  requestedByUserId: string;
  requestedByName?: string;
  submittedDate?: string;
  reviewedDate?: string;
  reviewedByUserId?: string;
  reviewedByName?: string;
  reviewNotes?: string;
  createdDate: string;
  lastModifiedDate?: string;
  convertedToProjectId?: string;
}

export interface CreateProjectRequestRequest {
  title: string;
  description: string;
  businessJustification: string;
  priority: RequestPriority;
}

export interface ProjectRequestListResponse {
  projectRequests: ProjectRequest[];
  totalCount: number;
}
