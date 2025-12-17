import { Column } from "../ui/DataTable";

export const createClaimReportTableColumns = (
  headers: string[]
): Column<any>[] => {
  return headers.map((header) => ({
    key: header,
    header: header,
    render: (claim: any) => {
      const value = claim[header];
      return (
        <div
          className="line-clamp-3 overflow-hidden max-w-[200px]"
          title={value?.toString() || "-"}
        >
          {value?.toString() || "-"}
        </div>
      );
    },
  }));
};
