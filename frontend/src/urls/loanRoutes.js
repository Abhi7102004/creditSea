import { Loan } from "./routes";

export const CreateNewLoan = `${Loan}/new-application`;
export const GetAllLoans = `${Loan}/applications`;
export const VerifyLoan = `${Loan}/applications/:applicationId/verify`;
export const ApproveLoan = `${Loan}/applications/:applicationId/approve`;
