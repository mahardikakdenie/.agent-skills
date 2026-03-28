import { Button } from "@repo/ui";
import { format } from "date-fns";
import { Trash } from "react-feather";
import { Column } from "../ui/DataTable";

interface CampaignItem {
  campaign_id: string;
  name: string;
  type: string;
  value_currency: string;
  value_type: string;
  value: number;
  start_date: string;
  end_date: string;
  active: boolean;
  minimum_amount: number;
  maximum_amount: number;
}

interface CampaignTableConfigProps {
  page: number;
  rowsPerPage: number;
  handleViewDetail: (id: string) => void;
  handleDelete: (id: string) => void;
  canDelete: boolean;
  renderStatus: (isActive: boolean) => string;
}

export const createCampaignTableColumns = ({
  page,
  rowsPerPage,
  handleViewDetail,
  handleDelete,
  canDelete,
  renderStatus,
}: CampaignTableConfigProps): Column<CampaignItem>[] => [
  {
    key: "index",
    header: "No.",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "name",
    header: "Campaign Name",
    className: "align-middle",
  },
  {
    key: "type",
    header: "Type",
    className: "text-center align-middle",
  },
  {
    key: "value_currency",
    header: "Currency",
    className: "text-center align-middle",
  },
  {
    key: "value",
    header: "Value",
    className: "text-center align-middle",
    render: (campaign) =>
      campaign.value_type === "percentage"
        ? `${campaign.value}%`
        : `${Number(campaign.value).toLocaleString()}`,
  },
  {
    key: "start_date",
    header: "Start Date",
    className: "text-center align-middle",
    render: (campaign) => format(new Date(campaign.start_date), "dd-MM-yyyy"),
  },
  {
    key: "end_date",
    header: "End Date",
    className: "text-center align-middle",
    render: (campaign) => format(new Date(campaign.end_date), "dd-MM-yyyy"),
  },
  {
    key: "active",
    header: "Active",
    className: "text-center align-middle",
    render: (campaign) => renderStatus(campaign.active),
  },
  {
    key: "action",
    header: "Action",
    className: "text-center align-middle w-20",
    render: (campaign) => (
      <div className="flex space-x-2">
        <button
          type="button"
          className="bg-[#016DA1] text-white px-4 py-2 rounded-full"
          onClick={() => handleViewDetail(campaign.campaign_id)}
        >
          View
        </button>

        <Button
          variant="ghost"
          onClick={() => handleDelete(campaign.campaign_id)}
          disabled={!canDelete}
          className="text-red-600 px-0"
        >
          <Trash />
        </Button>
      </div>
    ),
  },
];