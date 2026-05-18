import React, { useState } from 'react';
import { X } from 'react-feather';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import Modal from '@/components/modal';
import { delimiter, primary, primaryDisabled, primaryRed } from '@/constants/app-common.const';
import { capitalizeStringWithChar } from '@/helpers/app.helper';
import AddIcon from '@/images/add.icon';
import ChecklistIcon from '@/images/checklist.icon';
import SeeIcon from '@/images/see.icon';
import TrashIcon from '@/images/trash.icon';

interface MultipleSelectProps {
  list: any[];
  onChange: (value: string) => void;
  titleModal?: string;
  labelMultipleSelect: string;
}

const MultipleSelect: React.FC<MultipleSelectProps> = ({
  list,
  onChange,
  titleModal,
  labelMultipleSelect,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedData, setSelectedData] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const toggleOption = (value: string) => {
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((option) => option !== value) : [...prev, value],
    );
    onChange(value);
  };

  const selectData = (data: any) => {
    setSelectedData(data);
    toggleDetailViewModal();
  };

  const toggleDetailViewModal = () => setIsDetailModalOpen(!isDetailModalOpen);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Box className="relative">
      {selectedOptions && selectedOptions.length > 0 && (
        <Box className="text-xs max-h-[10vh] overflow-y-auto sm:scrollable">
          {selectedOptions.map((item, iIndex) => (
            <Box
              key={`item-${iIndex}`}
              className="bg-gray-100 rounded-md p-2 mb-2 flex items-center justify-between"
            >
              <Box as="p">{list.find((opt) => opt.value === item)?.name || '-'}</Box>
              <Box
                as="span"
                className="clickable"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(item);
                }}
              >
                {TrashIcon(primaryRed, '16', '16', '0 0 24 24')}
              </Box>
            </Box>
          ))}
        </Box>
      )}
      <Box className="mt-2">
        <Button
          variant="warning"
          onClick={handleOpenModal}
          withIcon={true}
          disabled={list.length < 1}
        >
          {AddIcon(list.length < 1 ? '#FFF' : '#000')}
          <Box as="span" className={`ml-1 ${list.length < 1 && 'text-white'}`}>
            Add {labelMultipleSelect}
          </Box>
        </Button>
      </Box>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        widthClassName="w-full lg:w-1/2"
        style={{ padding: '0 0.5rem' }}
        heightClassName="max-h-[80%]"
      >
        <Box className="-mx-4 -mt-2 pl-10 pr-4 py-4 rounded-t-md flex items-center justify-between bg-gray-200">
          <Box as="p" className="font-semibold text-primary">
            {titleModal ? titleModal : 'Select Options'}
          </Box>
          <X className="clickable" onClick={handleCloseModal} />
        </Box>
        <style jsx>{`
          .custom-checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid ${primaryDisabled};
            border-radius: 4px;
            appearance: none;
            display: inline-block;
            position: relative;
            cursor: pointer;
          }

          .custom-checkbox:checked {
            background-color: ${primary};
            border: 2px solid ${primary};
          }

          .custom-checkbox:checked::after {
            content: '✓';
            position: absolute;
            left: 2px;
            top: -1px;
            color: white;
            font-size: 16px;
          }
        `}</style>
        <Box className="max-h-[40vh] overflow-x-auto overflow-y-auto sm:scrollable">
          <Box as="table" className="min-w-full divide-y divide-gray-200">
            <Box as="thead" className="bg-white">
              <Box as="tr">
                <Box
                  as="th"
                  key={`header-select`}
                  className="px-6 py-6 whitespace-nowrap text-left text-sm font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Select
                </Box>
                {list &&
                  list.length > 0 &&
                  Object.keys(list[0])
                    .filter((kH) => kH !== 'value')
                    .map((kH, kHIndex) => (
                      <Box
                        as="th"
                        key={`header-${kHIndex}`}
                        className="px-6 py-6 whitespace-nowrap text-left text-sm font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {capitalizeStringWithChar(kH, '_')}
                      </Box>
                    ))}
              </Box>
            </Box>
            <Box as="tbody" className="bg-white divide-y divide-gray-200">
              {list &&
                list.length > 0 &&
                list.map((option, oIndex) => {
                  const allKeys = Object.keys(option);
                  return (
                    <Box as="tr" key={`value-option-${oIndex}`}>
                      <Box
                        as="td"
                        key={`checkbox-${oIndex}`}
                        className="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                      >
                        <Box
                          as="input"
                          type="checkbox"
                          className="custom-checkbox"
                          checked={selectedOptions.includes(option.value.toString())}
                          onChange={() => toggleOption(option.value.toString())}
                        />
                      </Box>
                      {allKeys &&
                        allKeys.length > 0 &&
                        allKeys
                          .filter((k) => k !== 'value')
                          .map((k, kIndex) =>
                            option[k].includes('icon') ? (
                              <Box
                                as="td"
                                key={`desc-${kIndex}`}
                                onClick={() => selectData(option)}
                                className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 truncate clickable"
                              >
                                {SeeIcon(primary)}
                              </Box>
                            ) : (
                              <Box
                                as="td"
                                key={`desc-${kIndex}`}
                                className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 truncate"
                              >
                                {option[k] || '-'}
                              </Box>
                            ),
                          )}
                    </Box>
                  );
                })}
            </Box>
          </Box>
        </Box>
        <Box className="flex items-center justify-center border-t pt-5 mb-5">
          <Button
            additionalClassName="w-full lg:w-fit justify-center lg:justify-between"
            onClick={handleCloseModal}
            variant="warning"
            withIcon={true}
          >
            {ChecklistIcon()}
            <Box as="span" className="ml-1">
              Add selected {labelMultipleSelect}
            </Box>
          </Button>
        </Box>
      </Modal>
      <Modal
        isOpen={isDetailModalOpen}
        onClose={toggleDetailViewModal}
        widthClassName="w-full lg:w-1/3"
        style={{ padding: '0 0.5rem' }}
        heightClassName="max-h-[50%]"
      >
        <Box className="-mr-4 -mt-2 pl-4 pr-4 py-4 rounded-t-md flex items-center justify-between">
          <Box as="p" className="font-semibold">
            Message Preview
          </Box>
          <X className="clickable" onClick={toggleDetailViewModal} />
        </Box>
        <Box className="mx-4 text-sm">
          <Box className="border-b-2 pb-3">
            {Object.keys(selectedData)
              .filter((dt) => dt !== 'value' && !selectedData[dt].includes('icon'))
              .map((dt, dtIndex) => (
                <Box
                  as="p"
                  key={`detail-${dtIndex}`}
                  className="whitespace-nowrap font-medium truncate"
                >
                  {capitalizeStringWithChar(dt, '_')}: {selectedData[dt] || '-'}
                </Box>
              ))}
          </Box>
          <Box className="my-3 max-h-40 overflow-y-auto sm:scrollable">
            <Box as="p" className="text-justify">
              {selectedData?.message?.split(delimiter)[1] || '-'}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MultipleSelect;
