import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { FaCheck, FaTimes, FaPlus } from 'react-icons/fa';

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
  const [selectAll, setSelectAll] = useState(false);

  const data = channels?.data || [];
  const totalItems = channels?.total || 0;
  const totalPages = Math.ceil(totalItems / showChannelsPerPage);

  useEffect(() => {
    setSelectAll(data.every(channel => globalSelectedChannels.has(channel.id)));
  }, [data, globalSelectedChannels]);

  useEffect(() => {
    if (isOpen) {
      onPageChangeChannel(currentPage);
    }
  }, [isOpen, currentPage, onPageChangeChannel]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChangeChannel(page);
    }
  };

  const handleCheckboxChange = (channelId: string) => {
    setGlobalSelectedChannels(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(channelId)) {
        newSelected.delete(channelId);
        onRemoveChannel(channelId); // Call to remove the channel from main state
      } else {
        newSelected.add(channelId);
      }
      return newSelected;
    });
  };


  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;  // Toggle selectAll state
    setSelectAll(newSelectAll);

    const newSelected = new Set(globalSelectedChannels);  // Copy the current selected channels

    if (newSelectAll) {
      // Selecting all channels
      data.forEach(channel => {
        newSelected.add(channel.id);
      });
    } else {
      // Deselecting all channels
      data.forEach(channel => {
        newSelected.delete(channel.id);
        onRemoveChannel(channel.id); // Remove each channel from the main state
      });
    }

    setGlobalSelectedChannels(newSelected);  // Update the selected channels
  };



  const handleApply = () => {
    const selectedChannelsData: Channel[] = Array.from(globalSelectedChannels)
      .map(channelId => data.find(channel => channel.id === channelId))
      .filter((channel): channel is Channel => Boolean(channel));

    onSelect(selectedChannelsData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-5xl h-[90vh] flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          <span className="text-[#016DA1]">Select Channels</span>
        </h2>

        <div className="overflow-y-auto flex-grow mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    className="form-checkbox"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.length > 0 ? (
                data.map(channel => (
                  <tr key={channel.id}>
                    <td className="px-2 py-1 text-center whitespace-nowrap text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={globalSelectedChannels.has(channel.id)}
                        onChange={() => handleCheckboxChange(channel.id)}
                        className="form-checkbox"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{channel.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{channel.type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No channels available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center items-center gap-2 font-normal mt-4">
          <label htmlFor="rowsPerPage">Showing:</label>
          <select
            id="rowsPerPage"
            className="p-2 border rounded"
            value={showChannelsPerPage}
            onChange={(e) => onChannelsPerPageChange(Number(e.target.value))}
          >
            {[10, 20, 30, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="mr-2">of {totalItems} items</span>

          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-500 text-white px-2 py-1 rounded flex items-center disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-500 text-white px-2 py-1 rounded flex items-center disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-3"
          >
            <FaCheck className="mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelSelectionModal;
