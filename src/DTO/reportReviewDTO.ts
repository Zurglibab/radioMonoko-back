export interface CreateReportReviewDTO {
  reporter_id?: string;
  review_id: string;
  report_type: string;
  description?: string;
}

export interface ReportReview {
  id: string;
  reporter_id: string;
  review_id: string;
  report_type: string;
  description?: string;
  created_at: string;
}
