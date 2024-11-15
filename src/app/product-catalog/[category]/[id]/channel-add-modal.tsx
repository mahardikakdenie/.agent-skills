import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useProducts } from "../../hooks";
import { useLoading } from "@/context/loading.context";

export default function ChannelAddModal(props: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  getChannels: Function;
  channels: any[];
  assignPlans: Function;
}) {
  const { id, open, setOpen, getChannels, channels, assignPlans } = props;
  useEffect(() => {
    (async () => await getChannels())();
  }, []);
  const [channel, setChannel] = useState<string>("");
  const { setLoading } = useLoading();
  const handleAssignPlans = async () => {
    if (channel) {
      setLoading(true);
      try {
        await assignPlans(id, channel);
      } catch (error) {
        console.error(error);
        alert("Failed to assign plan");
      }
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 w-[500px] max-w-full overflow-hidden">
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
      </DialogContent>
    </Dialog>
  );
}
