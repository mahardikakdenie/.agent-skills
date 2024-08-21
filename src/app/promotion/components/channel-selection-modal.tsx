import React, { useState } from 'react';
import { FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Channel {
  id: string;
  name: string;
  type: string;
}

interface ChannelResponseDTO {
  data: Channel[];
  total: number;
  limit: number;
  pageTotal: number;
  page: number;
}

interface ChannelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (channel: Channel) => void;
  channels?: ChannelResponseDTO;
  onPageChange: (page: number) => void;
}

const ChannelSelectionModal: React.FC<ChannelSelectionModalProps> = ({ isOpen, onClose, onSelect, channels, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(channels?.page || 1);

  if (!isOpen) return null;

  const data = channels?.data || [];
  const totalPages = channels?.pageTotal || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-3/4 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Select a Channel</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((channel) => (
                <tr key={channel.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{channel.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{channel.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => onSelect(channel)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No channels available</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
          >
            <FaChevronLeft />
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
          >
            Next
            <FaChevronRight />
          </button>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
          >
            <FaTrash className="mr-2" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelSelectionModal;