import { Button } from "@repo/ui";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { X } from "lucide-react";
import { useState } from "react";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";

export default function ChannelAddModal(props: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  channels: any[];
  assignPlans: Function;
  isLoadingAssignPlans: boolean;
}) {
  const { id, open, setOpen, channels, assignPlans, isLoadingAssignPlans } =
    props;

  const [channel, setChannel] = useState<string>("");
  const handleAssignPlans = async () => {
    if (channel) {
      try {
        await assignPlans({ planId: id, channel });
      } catch (error) {
        console.error(error);
      }
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent className="p-0 w-[500px] max-w-full overflow-hidden">
        <ContentLoadingWrapper isLoading={isLoadingAssignPlans}>
          <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
            <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
              Assign Plan
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
            <div className="relative">
              <Select value={channel} onValueChange={setChannel}>
                <SelectValue content="Channel" />
                <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                  <SelectValue content="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {channels.map((channel: any) => (
                      <SelectItem
                        key={channel.id}
                        value={`${channel.id}|${channel.name}`}
                      >
                        {channel.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button className="mt-5" onClick={handleAssignPlans}>
                Assign
              </Button>
            </div>
          </div>
        </ContentLoadingWrapper>
      </DialogContent>
    </Dialog>
  );
}
