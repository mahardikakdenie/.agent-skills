import { Column } from "@/components/ui/DataTable";

interface HospitalTableConfigProps {
  page: number;
  rowsPerPage: number;
}

export const createHospitalTableColumns = ({
  page,
  rowsPerPage,
}: HospitalTableConfigProps): Column<any>[] => [
  {
    key: "index",
    header: "No.",
    className: "whitespace-nowrap w-12 py-2",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "id_provider",
    header: "Profile ID",
    className: "min-w-32 py-2",
    render: (item) => item.reference?.id_provider,
  },
  {
    key: "name",
    header: "Provider Name",
    className: "min-w-48 py-2",
    render: (item) => item.name,
  },
  {
    key: "provider_type",
    header: "Provider Type",
    className: "min-w-36 py-2",
    render: (item) => item.reference?.provider_type,
  },
  {
    key: "name_province",
    header: "Province",
    className: "min-w-36 py-2",
    render: (item) => item.reference?.name_province,
  },
  {
    key: "name_city",
    header: "City",
    className: "min-w-36 py-2",
    render: (item) => item.reference?.name_city,
  },
  {
    key: "address",
    header: "Address",
    className: "min-w-64 py-2 whitespace-nowrap",
    render: (item) => item.reference?.address,
  },
  {
    key: "long",
    header: "Longitude",
    className: "min-w-32 py-2",
    render: (item) => item.reference?.long,
  },
  {
    key: "lat",
    header: "Latitude",
    className: "min-w-32 py-2",
    render: (item) => item.reference?.lat,
  },
  {
    key: "outpatient",
    header: "Facility OP",
    className: "min-w-32 py-2 ",
    render: (item) => (
      <div className="uppercase">{item.reference?.outpatient}</div>
    ),
  },
  {
    key: "inpatient",
    header: "Facility IP",
    className: "min-w-32 py-2",
    render: (item) => (
      <div className="uppercase">{item.reference?.inpatient}</div>
    ),
  },
  {
    key: "phone",
    header: "Phone",
    className: "min-w-32 py-2",
    render: (item) => item.reference?.phone,
  },
];
