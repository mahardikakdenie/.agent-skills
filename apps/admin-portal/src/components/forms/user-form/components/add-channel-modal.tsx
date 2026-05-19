import React from 'react';
import { Check, X } from 'react-feather';

import { Box, Button, Combobox } from '@repo/ui';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui';

export const ChannelModal = (props: {
  isChannelModalOpen: boolean;
  setIsChannelModalOpen: (open: boolean) => void;
  accountChannels: Array<{ id: string; name: string }>;
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

  const channelOptions = React.useMemo(
    () =>
      accountChannels.map((channel) => ({
        label: channel?.name || '-',
        value: String(channel?.id || ''),
      })),
    [accountChannels],
  );

  return (
    <Dialog open={isChannelModalOpen} onClose={() => setIsChannelModalOpen(false)}>
      <DialogContent className="flex max-h-[calc(100vh-48px)] w-[1000px] max-w-full flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 bg-[#F8F8F8] py-3 px-4 sm:px-6">
          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
            Select Channel
            <DialogClose className="ml-auto">
              <Button
                type="button"
                variant="ghost"
                className="bg-transparent hover:bg-transparent text-black p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <Box className="min-h-0 flex-1 overflow-y-auto p-4">
          <Combobox
            aria-label="Channel"
            size="lg"
            value={selectedChannels[0] || ''}
            options={channelOptions}
            placeholder="Select Channel"
            searchPlaceholder="Search Channel"
            loading={channelsLoading}
            clearable
            onValueChange={(value) => setSelectedChannels(value ? [value] : [])}
            triggerClassName="bg-white"
          />
        </Box>

        <DialogFooter className="shrink-0 sm:justify-center justify-center pb-4 sm:pb-6">
          <Button
            type="button"
            className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
            onClick={() => handleAddSelectedChannels(selectedChannels)}
            disabled={selectedChannels.length === 0}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
