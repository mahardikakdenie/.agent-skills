import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, DialogContent, Dialog, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { X, Check } from "react-feather";

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
    <Dialog open={isInsurerModalOpen} onOpenChange={setIsInsurerModalOpen}>
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

        <div className="p-4">
          <div className="grid gap-4">
            {insurersLoading ? (
              <div className="flex justify-center items-center py-4">
                <Spinner />
                Loading...
              </div>
            ) : (
              <Select
                onValueChange={(value) => {
                  const selectedInsurer = insurers.find(insurer => insurer.id === value);
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
          </div>
        </div>

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