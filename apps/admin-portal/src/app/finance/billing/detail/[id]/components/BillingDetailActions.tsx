import { useState } from 'react';
import { Check, Eye, X, FileCheck } from 'lucide-react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Box,
} from '@repo/ui';

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
    <Box className="mb-6">
      <Box className="flex flex-wrap gap-3">
        {billing.status === 'waiting-for-payment' && (
          <Button
            onClick={() => setOpenUpdateToPaid(true)}
            disabled={isUpdating}
            className="rounded-full bg-emerald-600 enabled:hover:bg-emerald-700 text-white h-10 px-5 border-none shadow-none"
            leftIcon={<Check className="w-5 h-5 text-white" />}
          >
            Mark as Paid
          </Button>
        )}

        <Button
          onClick={onViewInvoice}
          className="rounded-full bg-blue-600 enabled:hover:bg-blue-700 text-white h-10 px-5 border-none shadow-none"
          leftIcon={<Eye className="w-5 h-5 text-white" />}
        >
          View {isInsurer ? 'Invoice' : 'Billing Listing'}
        </Button>

        <Button
          onClick={() => setOpenCancel(true)}
          disabled={isUpdating}
          className="rounded-full border border-red-500 bg-white text-red-600 enabled:hover:bg-red-50 transition-all duration-200 h-10 px-5 shadow-none"
          leftIcon={<X className="w-5 h-5 text-red-600" />}
        >
          Cancel {billingType}
        </Button>

        {billing.status === 'pending-reconcilliation' && hasMatchedReconciliation && (
          <Button
            onClick={onConfirmReconciliation}
            disabled={isUpdating}
            className="rounded-full bg-emerald-600 enabled:hover:bg-emerald-700 text-white h-10 px-5 border-none shadow-none"
            leftIcon={<FileCheck className="w-5 h-5 text-white" />}
          >
            Confirm Reconciliation
          </Button>
        )}
      </Box>

      <Dialog open={openUpdateToPaid} onClose={() => setOpenUpdateToPaid(false)}>
        <DialogContent className="p-0 w-[500px] max-w-full overflow-hidden">
          <DialogHeader className="bg-slate-50 py-4 px-6">
            <Box className="flex items-center justify-between w-full">
              <DialogTitle className="text-slate-900 text-lg font-bold">Update to Paid</DialogTitle>
              <Button
                variant="ghost"
                size="xs"
                className="text-slate-500 hover:text-slate-900"
                onClick={() => setOpenUpdateToPaid(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </Box>
          </DialogHeader>
          <Box className="p-6">
            <Box as="p" className="text-slate-600">
              Are you sure you want to update this billing to paid?
            </Box>
            <DialogFooter className="mt-8 gap-3">
              <Button variant="outline" onClick={() => setOpenUpdateToPaid(false)} className="px-6">
                Cancel
              </Button>
              <Button
                onClick={handleUpdateToPaid}
                disabled={isUpdating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              >
                {isUpdating ? 'Updating...' : 'Confirm'}
              </Button>
            </DialogFooter>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
        <DialogContent className="p-0 w-[500px] max-w-full overflow-hidden">
          <DialogHeader className="bg-slate-50 py-4 px-6">
            <Box className="flex items-center justify-between w-full">
              <DialogTitle className="text-slate-900 text-lg font-bold">
                Cancel {billingType}
              </DialogTitle>
              <Button
                variant="ghost"
                size="xs"
                className="text-slate-500 hover:text-slate-900"
                onClick={() => setOpenCancel(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </Box>
          </DialogHeader>
          <Box className="p-6">
            <Box as="p" className="text-slate-600">
              Are you sure you want to cancel this {billingType.toLowerCase()}?
            </Box>
            <DialogFooter className="mt-8 gap-3">
              <Button variant="outline" onClick={() => setOpenCancel(false)} className="px-6">
                Cancel
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isUpdating}
                variant="destructive"
                className="px-8"
              >
                {isUpdating ? 'Cancelling...' : 'Confirm'}
              </Button>
            </DialogFooter>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
