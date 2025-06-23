import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "react-feather";

interface UserChannelsProps {
  accountChannels: Array<{
    id: string;
    channel: string;
  }>;
  channels: Array<any>;
  channelsMapById: Record<string, { name: string; }>;
  setIsChannelModalOpen: (isOpen: boolean) => void;
  handleDeleteChannel: (channelId: string) => void;
}

export const UserChannels = ({
  accountChannels,
  channels,
  channelsMapById,
  setIsChannelModalOpen,
  handleDeleteChannel,
}: UserChannelsProps) => {
  return <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="text-primary font-bold mb-2">
          User's Channels ({accountChannels.length})
        </div>
        <p className="text-sm text-black/60">
          <i>
            Assigned channels for this user. These channels determine which data the user can access.
          </i>
        </p>
      </div>
      <Button
        color="warning"
        type="button"
        className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full w-36"
        onClick={() => setIsChannelModalOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" /> Add Channel
      </Button>
    </div>

    {accountChannels.length > 0 && channels.length > 0 && (
      <div className="w-full bg-white rounded-lg overflow-auto">
        <Table className="table-search-params">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap py-2">Channel</TableHead>
              <TableHead className="py-2"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountChannels.map((accountChannel) => (
              <TableRow key={accountChannel.id}>
                <TableCell className="py-1">
                  {channelsMapById[accountChannel?.channel].name || "-"}
                </TableCell>
                <TableCell className="py-1 text-center">
                  <Button
                    type="button"
                    className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                    onClick={() => handleDeleteChannel(accountChannel.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}
  </div>;
};