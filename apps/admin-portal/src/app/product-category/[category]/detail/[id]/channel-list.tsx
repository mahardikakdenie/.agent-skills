import { Button } from "@repo/ui";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { Dialog } from "@repo/ui";
import { usePathname, useRouter } from "next/navigation";
import ChannelAddModal from "./channel-add-modal";
import { useEffect, useState } from "react";
import { useProducts } from "../../../hooks";
import { Trash2Icon, X } from "lucide-react";
import { UserCheck } from "react-feather";
import { ContentLoadingWrapper } from "@/components/ui/loading";

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
    isLoadingUnAssignPlans,
  } = useProducts({
    planId: id,
  });
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<string>("");
  const [openUnassignPlanConfirmation, setOpenUnassignPlanConfirmation] =
    useState(false);

  const handleUnassignPlan = async () => {
    try {
      await unAssignPlans({ planId: id, channelId: channel });
    } catch (error) {
      console.error(error);
    }
    setOpenUnassignPlanConfirmation(false);
  };
  return (
    <div>
      <Button className="btn btn-primary" onClick={() => setOpen(true)}>
        <UserCheck className="w-5 h-5 mr-2" /> Assign Plan
      </Button>
      <Table className="table-search-params mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Channel</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {channelPlans?.map((channelPlan: any) => (
            <TableRow key={channelPlan.id}>
              <TableCell>{channelPlan.channel_name}</TableCell>
              <TableCell>
                <Button
                  variant={"outline"}
                  onClick={() => {
                    setChannel(channelPlan.channel);
                    setOpenUnassignPlanConfirmation(true);
                  }}
                  size="md"
                  className="w-9 px-0"
                >
                  <Trash2Icon size={20} color="red" />
                </Button>
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
      <Dialog
        open={openUnassignPlanConfirmation}
        onClose={() => setOpenUnassignPlanConfirmation(false)}
      >
        <DialogContent className="p-0 w-[500px] max-w-full overflow-hidden">
          <ContentLoadingWrapper isLoading={isLoadingUnAssignPlans}>
            <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
              <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                Unassign Plan
                <DialogClose className="ml-auto">
                  <Button
                    type="button"
                    className="bg-transparent hover:bg-transparent text-black p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Are you sure you want to unassign this plan?</p>
              <div className="flex justify-end mt-5">
                <Button
                  className="btn btn-primary"
                  onClick={handleUnassignPlan}
                >
                  Unassign
                </Button>
              </div>
            </div>
          </ContentLoadingWrapper>
        </DialogContent>
      </Dialog>
    </div>
  );
}
