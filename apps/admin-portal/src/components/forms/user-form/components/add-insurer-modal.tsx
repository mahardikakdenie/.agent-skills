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

export const InsurerModal = (props: {
  isInsurerModalOpen: boolean;
  setIsInsurerModalOpen: (open: boolean) => void;
  accountInsurers: Array<{ id: string; insurance?: string }>;
  insurers: Array<{ id: string; name: string }>;
  selectedInsurers: string[];
  setSelectedInsurers: (insurers: string[]) => void;
  insurersLoading: boolean;
  handleAddSelectedInsurers: (insurers: string[]) => void;
}) => {
  const {
    isInsurerModalOpen,
    setIsInsurerModalOpen,
    selectedInsurers,
    setSelectedInsurers,
    insurersLoading,
    handleAddSelectedInsurers,
    insurers,
  } = props;

  const insurerOptions = React.useMemo(
    () =>
      insurers.map((insurer) => ({
        label: insurer?.name || '-',
        value: String(insurer?.id || ''),
      })),
    [insurers],
  );

  return (
    <Dialog open={isInsurerModalOpen} onClose={() => setIsInsurerModalOpen(false)}>
      <DialogContent className="flex max-h-[calc(100vh-48px)] w-[1000px] max-w-full flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 bg-[#F8F8F8] py-3 px-4 sm:px-6">
          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
            Select Insurer
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
            aria-label="Insurer"
            size="lg"
            value={selectedInsurers[0] || ''}
            options={insurerOptions}
            placeholder="Select Insurer"
            searchPlaceholder="Search Insurer"
            loading={insurersLoading}
            clearable
            onValueChange={(value) => setSelectedInsurers(value ? [value] : [])}
            triggerClassName="bg-white"
          />
        </Box>

        <DialogFooter className="shrink-0 sm:justify-center justify-center pb-4 sm:pb-6">
          <Button
            type="button"
            className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
            onClick={() => handleAddSelectedInsurers(selectedInsurers)}
            disabled={selectedInsurers.length === 0}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
