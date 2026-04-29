import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Trash, UserCheck } from 'react-feather';

import { Box, Button } from '@repo/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui';

import { useProducts } from '../../../hooks';
import ChannelAddModal from './channel-add-modal';

export default function ChannelList(props: { id: string }) {
  const { id } = props;
  const router = useRouter();
  const path = usePathname();
  const {
    channelPlans,
    unAssignPlans,
    channels,
    assignPlans,
    isLoadingAssignPlans,
    canEdit,
    canDelete,
  } = useProducts({
    planId: id,
  });
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box className="flex justify-end gap-x-4 mb-4">
        <Button
          className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black cursor-pointer"
          disabled={!canEdit}
          onClick={() => setOpen(true)}
        >
          <UserCheck className="w-5 h-5" /> Assign Plan
        </Button>
      </Box>
      <Table className="table-search-params mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Channel</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {channelPlans?.map((channelPlan: any) => (
            <TableRow key={channelPlan.id}>
              <TableCell>{channelPlan.channel_name}</TableCell>
              <TableCell className="text-center">
                <Box className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    disabled={!canDelete}
                    onClick={async () => {
                      if (confirm("Are you sure to delete this row?")) {
                        await unAssignPlans({ planId: id, channelId: channelPlan.channel });
                      }
                    }}
                    className="h-7 w-7 p-0 rounded-md text-red-600 hover:bg-red-50 hover:!text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ChannelAddModal
        id={id}
        open={open}
        setOpen={(open) => setOpen(open)}
        channels={channels}
        assignPlans={assignPlans}
        isLoadingAssignPlans={isLoadingAssignPlans}
      />
    </Box>
  );
}
