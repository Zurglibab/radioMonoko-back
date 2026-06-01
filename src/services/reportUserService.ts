import { reportUsersDAO } from '../DAO/reportUsersDAO';
import { CreateReportUserDTO, ReportUser } from '../DTO/reportUserDTO';
import { UserDAO } from '../DAO/userDAO';
import { PaginationOptions } from '../utils/pagination';

export class ReportUserService {
  private userDAO = new UserDAO();

  async createReport(reporterId: string, dto: CreateReportUserDTO): Promise<ReportUser> {
    const reporter = await this.userDAO.findById(reporterId);
    if (!reporter) throw new Error('Reporter user not found');

    const reported = await this.userDAO.findById(dto.reported_user_id);
    if (!reported) throw new Error('Reported user not found');

    const toCreate: CreateReportUserDTO = {
      reporter_id: reporterId,
      reported_user_id: dto.reported_user_id,
      report_type: dto.report_type,
      description: dto.description
    };

    return await reportUsersDAO.create(toCreate);
  }

  async getAllReports(pagination?: PaginationOptions): Promise<ReportUser[]> {
    return await reportUsersDAO.findAll(pagination);
  }

  async getReportsByReportedUserId(reportedUserId: string, pagination?: PaginationOptions): Promise<ReportUser[]> {
    return await reportUsersDAO.findByReportedUserId(reportedUserId, pagination);
  }
}

export const reportUserService = new ReportUserService();