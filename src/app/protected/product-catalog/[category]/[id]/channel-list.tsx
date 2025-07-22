import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePathname, useRouter } from "next/navigation";
import ChannelAddModal from "./channel-add-modal";
import { useEffect, useState } from "react";
import { useProducts } from "../../hooks";
import { Trash, Trash2, Trash2Icon, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { set } from "date-fns";
import { useLoading } from "@/context/loading.context";
import { UserCheck } from "react-feather";

export default function ChannelList(props: { id: string }) {
  const { id } = props;
  const router = useRouter();
  const path = usePathname();
  const {
    getChannelPlans,
    channelPlans,
    unAssignPlans,
    channels,
    assignPlans,
    getChannels,
  } = useProducts();
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<string>("");
  const [openUnassignPlanConfirmation, setOpenUnassignPlanConfirmation] =
    useState(false);
  useEffect(() => {
    (async () => await getChannelPlans(id))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { setLoading } = useLoading();
  const handleUnassignPlan = async () => {
    try {
      setLoading(true);
      await unAssignPlans(id, channel);
    } catch (error) {
      console.error(error);
      alert("Failed to unassign plan");
    }
    setLoading(false);
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
                  size={"icon"}
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
        getChannels={getChannels}
        assignPlans={assignPlans}
      />
      <Dialog
        open={openUnassignPlanConfirmation}
        onOpenChange={setOpenUnassignPlanConfirmation}
      >
        <DialogContent className="p-0 w-[500px] max-w-full overflow-hidden">
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
              <Button className="btn btn-primary" onClick={handleUnassignPlan}>
                Unassign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
