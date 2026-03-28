import { useState } from "react";
import { Button } from "@repo/ui";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui";
import { X } from "lucide-react";

interface BillingDetailActionsProps {
  billing: any;
  isInsurer: boolean;
  billingType: string;
  hasMatchedReconciliation: boolean;
  isUpdating: boolean;
  onUpdateToPaid: () => void;
  onCancel: () => void;
  onConfirmReconciliation: () => void;
  onViewInvoice: () => void;
}

export const BillingDetailActions = ({
  billing,
  isInsurer,
  billingType,
  hasMatchedReconciliation,
  isUpdating,
  onUpdateToPaid,
  onCancel,
  onConfirmReconciliation,
  onViewInvoice,
}: BillingDetailActionsProps) => {
  const [openUpdateToPaid, setOpenUpdateToPaid] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

  const handleUpdateToPaid = () => {
    setOpenUpdateToPaid(false);
    onUpdateToPaid();
  };

  const handleCancel = () => {
    setOpenCancel(false);
    onCancel();
  };

  return (
    <div className="md:px-6 px-4 mx-5 mb-5">
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setOpenUpdateToPaid(true)}
          disabled={billing.status !== "waiting-for-payment" || isUpdating}
          className="rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          ? Mark as Paid
        </Button>

        <Button
          onClick={onViewInvoice}
          className="rounded-full bg-blue-600 hover:bg-blue-700"
        >
          ?? View {isInsurer ? "Invoice" : "Billing Listing"}
        </Button>

        <Button
          onClick={() => setOpenCancel(true)}
          disabled={isUpdating}
          variant="destructive"
          className="rounded-full bg-white border text-red-700 border-red-700 hover:bg-red-700 hover:text-white"
        >
          ? Cancel {billingType}
        </Button>

        {billing.status === "pending-reconcilliation" &&
          hasMatchedReconciliation && (
            <Button
              onClick={onConfirmReconciliation}
              disabled={isUpdating}
              className="rounded-full bg-green-600 hover:bg-green-700"
            >
              ? Confirm Reconciliation
            </Button>
          )}
      </div>

      <Dialog open={openUpdateToPaid} onClose={() => setOpenUpdateToPaid(false)}>
        <DialogContent className="p-0 w-[500px] max-w-full overflow-hidden">
          <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
            <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
              Update to Paid
              <Button
                type="button"
                className="bg-transparent hover:bg-transparent text-black p-0 ml-auto"
                onClick={() => setOpenUpdateToPaid(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Are you sure you want to update this billing to paid?</p>
            <div className="flex justify-end gap-3 mt-5">
              <Button
                variant="outline"
                onClick={() => setOpenUpdateToPaid(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateToPaid}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isUpdating ? "Updating..." : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
        <DialogContent className="p-0 w-[500px] max-w-full overflow-hidden">
          <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
            <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
              Cancel {billingType}
              <Button
                type="button"
                className="bg-transparent hover:bg-transparent text-black p-0 ml-auto"
                onClick={() => setOpenCancel(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>
              Are you sure you want to cancel this {billingType.toLowerCase()}?
            </p>
            <div className="flex justify-end gap-3 mt-5">
              <Button variant="outline" onClick={() => setOpenCancel(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isUpdating}
                variant="destructive"
              >
                {isUpdating ? "Cancelling..." : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};