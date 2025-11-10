import { Column } from "@/components/ui/DataTable";

export interface ExportUser {
  name: string;
  email: string;
  phone: string;
}

export interface ExportUsersTableConfigProps {
  page: number;
  rowsPerPage: number;
}

export const createExportUsersTableColumns = ({
  page,
  rowsPerPage,
}: ExportUsersTableConfigProps): Column<ExportUser>[] => [
  {
    key: "index",
    header: "No",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "name",
    header: "Name",
    render: (user) => <div>{user.name || "-"}</div>,
  },
  {
    key: "email",
    header: "Email",
    render: (user) => <div>{user.email || "-"}</div>,
  },
  {
    key: "phone",
    header: "Phone Number",
    render: (user) => <div>{user.phone || "-"}</div>,
  },
];