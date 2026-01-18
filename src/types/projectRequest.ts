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
  requestingUserId: string;
  requestingUser?: {  // NEW!
    id: string;
    fullName: string;
    email: string;
  };
  reviewedByUser?: {  // NEW!
    id: string;
    fullName: string;
    email: string;
  };
  requestedByUserId: string;
  requestedByName?: string;
  submittedDate?: string;
  reviewedDate?: string;
  reviewedByUserId?: string;
  reviewedByName?: string;
  reviewNotes?: string;
  approvalDate?: string;
  approvedByUserId?: string;
  approvedByUser?: {  // NEW!
    id: string;
    fullName: string;
    email: string;
  };
  approvedDate?: string;
  approvalNotes?: string;
  denialReason?: string;
  cancellationReason?: string;
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
