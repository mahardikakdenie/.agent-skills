import noData from '@public/images/no-data.webp';
import React, { useEffect, useMemo, useState } from 'react';
import { Check, X } from 'react-feather';

import {
  Box,
  Button,
  Checkbox,
  DataTable,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Image,
  type ColumnDef,
} from '@repo/ui';

import { CompactTablePagination } from '@/components/ui/compact-table-pagination';

interface Channel {
  id: string;
  name: string;
  type: string;
}

interface ChannelResponseDTO {
  data: Channel[];
  total: number;
  limit: number;
  page: number;
  pageTotal: number;
}

interface ChannelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (channels: Channel[]) => void;
  channels?: ChannelResponseDTO;
  onPageChangeChannel: (page: number) => void;
  selectedChannelIds: Set<string>;
  showChannelsPerPage: number;
  onChannelsPerPageChange: (channelsPerPage: number) => void;
  globalSelectedChannels: Set<string>;
  setGlobalSelectedChannels: React.Dispatch<React.SetStateAction<Set<string>>>;
  onRemoveChannel: (channelId: string) => void;
}

const pageSizeOptions = [10, 20, 30, 50];

const ChannelSelectionModal: React.FC<ChannelSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  channels,
  onPageChangeChannel,
  selectedChannelIds,
  showChannelsPerPage,
  onChannelsPerPageChange,
  globalSelectedChannels,
  setGlobalSelectedChannels,
  onRemoveChannel,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChannelMap, setSelectedChannelMap] = useState<Map<string, Channel>>(new Map());

  const data = useMemo(() => channels?.data || [], [channels?.data]);
  const totalItems = channels?.total || 0;
  const totalPages = Math.max(
    channels?.pageTotal || Math.ceil(totalItems / showChannelsPerPage),
    1,
  );
  const selectedIds = globalSelectedChannels.size > 0 ? globalSelectedChannels : selectedChannelIds;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    onPageChangeChannel(currentPage);
  }, [currentPage, isOpen, onPageChangeChannel]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedChannelMap((prevSelectedChannels) => {
      const nextSelectedChannels = new Map(
        Array.from(prevSelectedChannels).filter(([channelId]) => selectedIds.has(channelId)),
      );

      data.forEach((channel) => {
        if (selectedIds.has(channel.id)) {
          nextSelectedChannels.set(channel.id, channel);
        }
      });

      return nextSelectedChannels;
    });
  }, [data, isOpen, selectedIds]);

  const isAllSelected =
    data.length > 0 && data.every((channel) => globalSelectedChannels.has(channel.id));

  const handleCheckboxChange = React.useCallback(
    (channel: Channel) => {
      if (globalSelectedChannels.has(channel.id)) {
        setSelectedChannelMap((prevSelectedChannels) => {
          const nextSelectedChannels = new Map(prevSelectedChannels);
          nextSelectedChannels.delete(channel.id);
          return nextSelectedChannels;
        });
        onRemoveChannel(channel.id);
        return;
      }

      setSelectedChannelMap((prevSelectedChannels) => {
        const nextSelectedChannels = new Map(prevSelectedChannels);
        nextSelectedChannels.set(channel.id, channel);
        return nextSelectedChannels;
      });
      setGlobalSelectedChannels((prevSelectedChannels) => {
        const nextSelectedChannels = new Set(prevSelectedChannels);
        nextSelectedChannels.add(channel.id);
        return nextSelectedChannels;
      });
    },
    [globalSelectedChannels, onRemoveChannel, setGlobalSelectedChannels],
  );

  const handleSelectAllChange = React.useCallback(() => {
    if (isAllSelected) {
      data.forEach((channel) => {
        onRemoveChannel(channel.id);
      });

      setSelectedChannelMap((prevSelectedChannels) => {
        const nextSelectedChannels = new Map(prevSelectedChannels);
        data.forEach((channel) => {
          nextSelectedChannels.delete(channel.id);
        });
        return nextSelectedChannels;
      });
      return;
    }

    setSelectedChannelMap((prevSelectedChannels) => {
      const nextSelectedChannels = new Map(prevSelectedChannels);
      data.forEach((channel) => {
        nextSelectedChannels.set(channel.id, channel);
      });
      return nextSelectedChannels;
    });
    setGlobalSelectedChannels((prevSelectedChannels) => {
      const nextSelectedChannels = new Set(prevSelectedChannels);
      data.forEach((channel) => {
        nextSelectedChannels.add(channel.id);
      });
      return nextSelectedChannels;
    });
  }, [data, isAllSelected, onRemoveChannel, setGlobalSelectedChannels]);

  const handleApply = React.useCallback(() => {
    onSelect(Array.from(selectedChannelMap.values()));
    onClose();
  }, [onClose, onSelect, selectedChannelMap]);

  const channelModalColumns = useMemo<ColumnDef<Channel>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAllChange}
            className="justify-center"
          />
        ),
        enableSorting: false,
        enableResizing: false,
        size: 56,
        minSize: 56,
        meta: {
          headerCellClassName: 'w-14 whitespace-nowrap text-center',
          cellClassName: 'w-14 text-center align-middle',
          cellContentClassName: 'flex items-center justify-center',
        },
        cell: ({ row }) => {
          const channel = row.original;

          return (
            <Box onClick={(event) => event.stopPropagation()}>
              <Checkbox
                checked={globalSelectedChannels.has(channel.id)}
                onCheckedChange={() => handleCheckboxChange(channel)}
                className="justify-center"
              />
            </Box>
          );
        },
      },
      {
        id: 'name',
        accessorFn: (channel) => channel?.name || '-',
        header: 'Name',
        enableSorting: false,
        size: 520,
        minSize: 240,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const channel = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm font-medium leading-5 text-slate-900"
              onClick={() => handleCheckboxChange(channel)}
            >
              {channel?.name || '-'}
            </Box>
          );
        },
      },
      {
        id: 'type',
        accessorFn: (channel) => channel?.type || '-',
        header: 'Type',
        enableSorting: false,
        size: 280,
        minSize: 180,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const channel = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm leading-5 text-slate-600"
              onClick={() => handleCheckboxChange(channel)}
            >
              {channel?.type || '-'}
            </Box>
          );
        },
      },
    ],
    [globalSelectedChannels, handleCheckboxChange, handleSelectAllChange, isAllSelected],
  );

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="flex max-h-[calc(100vh-48px)] w-[1000px] max-w-full flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 bg-[#F8F8F8] py-3 px-4 sm:px-6">
          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
            Select Channels
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
          <DataTable
            className="!gap-3 [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-2.5"
            data={data}
            columns={channelModalColumns}
            pagination={{
              pageIndex: currentPage - 1,
              pageSize: showChannelsPerPage,
              pageCount: totalPages,
              rowCount: totalItems,
              onPageChange: (pageIndex) => {
                setCurrentPage(pageIndex + 1);
              },
              onPageSizeChange: (pageSize) => {
                setCurrentPage(1);
                onChannelsPerPageChange(pageSize);
              },
            }}
            pageSizeOptions={pageSizeOptions}
            getRowClassName={({ row }) =>
              globalSelectedChannels.has(row.original.id)
                ? 'bg-slate-50 hover:!bg-slate-50'
                : undefined
            }
            emptyState={
              <Box className="sticky left-0 flex min-h-[14rem] w-[100cqw] items-center justify-center py-6">
                <Box className="flex flex-col items-center justify-center gap-3">
                  <Image alt="no data" src={noData.src} width={180} fit="contain" />
                  <Box as="span">No channels available</Box>
                </Box>
              </Box>
            }
            renderPagination={(table) => (
              <Box className="-mt-1">
                <CompactTablePagination table={table} pageSizeOptions={pageSizeOptions} />
              </Box>
            )}
            tableOptions={{
              manualPagination: true,
              enableColumnResizing: false,
              defaultColumn: {
                minSize: 56,
                size: 160,
              },
              getRowId: (channel, index) => channel?.id || `channel-row-${index}`,
            }}
          />
        </Box>

        <DialogFooter className="shrink-0 sm:justify-center justify-center pb-4 sm:pb-6">
          <Button
            type="button"
            className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
            onClick={handleApply}
            disabled={globalSelectedChannels.size === 0}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelSelectionModal;
