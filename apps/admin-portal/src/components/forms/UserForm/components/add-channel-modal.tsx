import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
  DialogClose,
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
import { Spinner } from "@repo/ui";
import { X, Check } from "react-feather";

export const ChannelModal = (props: {
  isChannelModalOpen: boolean;
  setIsChannelModalOpen: (open: boolean) => void;
  accountChannels: any[];
  selectedChannels: string[];
  setSelectedChannels: (channels: string[]) => void;
  channelsLoading: boolean;
  handleAddSelectedChannels: (channels: string[]) => void;
}) => {
  const {
    isChannelModalOpen,
    setIsChannelModalOpen,
    accountChannels,
    selectedChannels,
    setSelectedChannels,
    channelsLoading,
    handleAddSelectedChannels,
  } = props;
  return (
    <Dialog open={isChannelModalOpen} onClose={() => setIsChannelModalOpen(false)}>
      <DialogContent className="p-0 w-[1000px] max-w-full overflow-hidden">
        <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center justify-between">
            Select Channel
            <DialogClose>
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
          <div className="grid gap-4">
            {channelsLoading ? (
              <div className="flex justify-center items-center py-4">
                <Spinner
                  inline
                  className="[&_[data-slot=spinner-icon]]:size-10 [&_[data-slot=spinner-icon]]:text-blue-500"
                />
                Loading...
              </div>
            ) : (
              <Select
                onValueChange={(value) => {
                  const selectedChannel = accountChannels.find(
                    (channel) => channel.id === value
                  );
                  if (selectedChannel) {
                    setSelectedChannels([value]);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {accountChannels.map((channel) => (
                      <SelectItem key={channel.id} value={channel.id}>
                        {channel.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-center justify-center pb-4 sm:pb-6">
          <DialogClose asChild>
            <Button
              type="button"
              className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
              onClick={() => handleAddSelectedChannels(selectedChannels)}
            >
              <Check className="w-4 h-4 mr-2" /> Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

