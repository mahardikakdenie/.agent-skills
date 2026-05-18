import { X, Check } from 'react-feather';

import { Box, Button } from '@repo/ui';
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
  DialogClose,
  DialogTitle,
} from '@repo/ui';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';
import { Spinner } from '@repo/ui';

export const InsurerModal = (props: {
  isInsurerModalOpen: boolean;
  setIsInsurerModalOpen: (open: boolean) => void;
  accountInsurers: any[];
  insurers: any[];
  selectedInsurers: string[];
  setSelectedInsurers: (insurers: string[]) => void;
  insurersLoading: boolean;
  handleAddSelectedInsurers: (insurers: string[]) => void;
}) => {
  const {
    isInsurerModalOpen,
    setIsInsurerModalOpen,
    accountInsurers,
    selectedInsurers,
    setSelectedInsurers,
    insurersLoading,
    handleAddSelectedInsurers,
    insurers,
  } = props;

  return (
    <Dialog open={isInsurerModalOpen} onClose={() => setIsInsurerModalOpen(false)}>
      <DialogContent className="p-0 w-[1000px] max-w-full overflow-hidden">
        <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center justify-between">
            Select Insurer
            <DialogClose>
              <Button type="button" className="bg-transparent hover:bg-transparent text-black p-0">
                <X className="w-5 h-5" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <Box className="p-4">
          <Box className="grid gap-4">
            {insurersLoading ? (
              <Box className="flex justify-center items-center py-4">
                <Spinner
                  inline
                  className="[&_[data-slot=spinner-icon]]:size-10 [&_[data-slot=spinner-icon]]:text-blue-500"
                />
                Loading...
              </Box>
            ) : (
              <Select
                onValueChange={(value) => {
                  const selectedInsurer = insurers.find((insurer) => insurer.id === value);
                  if (selectedInsurer) {
                    setSelectedInsurers([value]);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an insurer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {insurers.map((insurer) => (
                      <SelectItem key={insurer.id} value={insurer.id}>
                        {insurer.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </Box>
        </Box>

        <DialogFooter className="sm:justify-center justify-center pb-4 sm:pb-6">
          <DialogClose asChild>
            <Button
              type="button"
              className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
              onClick={() => handleAddSelectedInsurers(selectedInsurers)}
            >
              <Check className="w-4 h-4 mr-2" /> Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
