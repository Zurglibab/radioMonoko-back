import { reportUsersDAO } from '../DAO/reportUsersDAO';
import { CreateReportUserDTO, ReportUser } from '../DTO/reportUserDTO';
import { UserDAO } from '../DAO/userDAO';

export class ReportUserService {
	private userDAO = new UserDAO();

	async createReport(reporterId: string, dto: CreateReportUserDTO): Promise<ReportUser> {
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
}

export const reportUserService = new ReportUserService();


