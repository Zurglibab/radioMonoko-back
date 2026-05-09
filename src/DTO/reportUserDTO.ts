export interface CreateReportUserDTO {
    reporter_id?: string; // filled server-side
    reported_user_id: string;
    report_type: string;
    description?: string;
}

export interface ReportUser {
    id: string;
    reporter_id: string;
    reported_user_id: string;
    report_type: string;
    description?: string;
    created_at: string;
}

