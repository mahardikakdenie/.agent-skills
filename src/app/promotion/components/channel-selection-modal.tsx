import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { FaCheck, FaTimes } from 'react-icons/fa';

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
}

const ChannelSelectionModal: React.FC<ChannelSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  channels,
  onPageChangeChannel,
  selectedChannelIds,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set(selectedChannelIds));
  const [selectAll, setSelectAll] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const data = channels?.data || [];
  const totalPages = channels?.pageTotal || 1;
  const totalItems = channels?.total || 0;

  useEffect(() => {
    setSelectedChannels(new Set(selectedChannelIds));
  }, [selectedChannelIds]);

  useEffect(() => {
    const allSelected = data.every(channel => selectedChannels.has(channel.id));
    setSelectAll(allSelected);
  }, [data, selectedChannels]);

  useEffect(() => {
    onPageChangeChannel(currentPage);
  }, [currentPage, onPageChangeChannel]);

  useEffect(() => {
    // Fetch channels when modal opens and currentPage changes
    if (isOpen) {
      onPageChangeChannel(currentPage);
    }
  }, [isOpen, currentPage, onPageChangeChannel]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!isOpen) return null;

  const handleCheckboxChange = (channelId: string) => {
    setSelectedChannels(prevSelected => {
      const newSelected = new Set(prevSelected);
      newSelected.has(channelId) ? newSelected.delete(channelId) : newSelected.add(channelId);
      return newSelected;
    });
  };

  const handleSelectAllChange = () => {
    setSelectAll(prevSelectAll => {
      const allChannelIds = new Set(data.map(channel => channel.id));
      if (prevSelectAll) {
        setSelectedChannels(new Set()); // Clear selection
      } else {
        setSelectedChannels(allChannelIds); // Select all
      }
      return !prevSelectAll; // Toggle selectAll
    });
  };

  const handleApply = () => {
    const selectedChannelsArray = data.filter(channel => selectedChannels.has(channel.id));
    onSelect(selectedChannelsArray);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl h-[90vh] flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          <span className="text-[#016DA1]">Select Channels</span>
        </h2>
        
        {/* Make the table scrollable */}
        <div className="overflow-y-auto flex-grow mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map(channel => (
                  <tr key={channel.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={selectedChannels.has(channel.id)}
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

        <div className="flex justify-center items-center gap-2 font-normal mt-4">
          <label htmlFor="rowsPerPage">Showing:</label>
          <select
            id="rowsPerPage"
            className="p-2 border rounded"
            value={rowsPerPage}
            onChange={(e) => {
              const newRowsPerPage = Number(e.target.value);
              setRowsPerPage(newRowsPerPage);
              setCurrentPage(1); // Reset to first page when rows per page change
            }}
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
            title="Previous"
            className="bg-gray-500 text-white px-2 py-1 rounded flex items-center disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Next"
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
