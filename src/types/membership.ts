export interface Profile {
  policy_number: string | null;
  subsidiary: string | null;
  employee_id: string | null;
  employee_name: string | null;
  member_name: string | null;
  gender: string | null;
  date_of_birth: string | null;
  member_status: string | null;
  marital_status: string | null;
  plan: string | null;
  effective_date: string | null;
  remarks: string | null;
  bank_name: string | null;
  branch: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  email: string | null;
  submission_date: string | null;
}

export interface RawMembershipItem {
  id: string;
  policy: string;
  number: string;
  type: string;
  status: string;
  profile: Profile;
}

export interface MembershipItem {
  id: string;
  policyNumber: string;
  subsidiary: string;
  employeeId: string;
  employeeName: string;
  memberName: string;
  gender: string;
  dob: string;
  memberStatus: string;
  maritalStatus: string;
  plan: string;
  effectiveDate: string;
  remarks: string;
  bankName: string;
  branch: string;
  bankAccountNumber: string;
  bankAccountName: string;
  email: string;
  submissionDate: string;
  status: string;
}

export interface MembershipResponse {
  data: RawMembershipItem[];
  page: number;
  limit: number;
  total: number;
  pageTotal: number;
}


export const mapMembershipResponse = (data: RawMembershipItem[]): MembershipItem[] => {
  return data.map((item) => ({
    id: item.id,
    policyNumber: item.profile.policy_number || "-",
    subsidiary: item.profile.subsidiary || "-",
    employeeId: item.profile.employee_id || "-",
    employeeName: item.profile.employee_name || "-",
    memberName: item.profile.member_name || "-",
    gender: item.profile.gender || "-",
    dob: item.profile.date_of_birth || "-",
    memberStatus: item.profile.member_status || "-",
    maritalStatus: item.profile.marital_status || "-",
    plan: item.profile.plan || "-",
    effectiveDate: item.profile.effective_date || "-",
    remarks: item.profile.remarks || "-",
    bankName: item.profile.bank_name || "-",
    branch: item.profile.branch || "-",
    bankAccountNumber: item.profile.bank_account_number || "-",
    bankAccountName: item.profile.bank_account_name || "-",
    email: item.profile.email || "-",
    submissionDate: item.profile.submission_date || "-",
    status: item.status || "-",
  }));
};