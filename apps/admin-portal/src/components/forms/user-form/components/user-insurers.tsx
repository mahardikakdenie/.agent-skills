import { Plus, Trash2 } from 'react-feather';

import { Box, Button } from '@repo/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui';

interface UserInsurersProps {
  accountInsurers: Array<{
    id: string;
    insurance: string;
  }>;
  insurers: Array<any>;
  insurersMapById: Record<string, { name: string }>;
  setIsInsurerModalOpen: (isOpen: boolean) => void;
  handleDeleteInsurer: (insurerId: string) => void;
}

export const UserInsurers = ({
  accountInsurers,
  insurers,
  insurersMapById,
  setIsInsurerModalOpen,
  handleDeleteInsurer,
}: UserInsurersProps) => {
  return (
    <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
      <Box className="flex gap-4 items-center">
        <Box>
          <Box className="text-primary font-bold mb-2">
            User&apos;s Insurers ({accountInsurers.length})
          </Box>
          <Box as="p" className="text-sm text-black/60 italic">
            Assigned insurers for this user. These insurers determine which insurance products the
            user can access.
          </Box>
        </Box>
        <Button
          type="button"
          className="h-10 rounded-full px-5 text-black ml-auto bg-[#F5BA41] hover:bg-[#e6a92d]"
          onClick={() => setIsInsurerModalOpen(true)}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Add Insurer
        </Button>
      </Box>

      {accountInsurers.length > 0 && insurers.length > 0 && (
        <Box className="w-full bg-white rounded-lg overflow-auto mt-1">
          <Table className="table-search-params border-collapse">
            <TableHeader className="bg-[#0073A8] hover:bg-[#0073A8] border-none">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="whitespace-nowrap py-3 pl-4 pr-1 text-white font-bold h-11 border-none">
                  Insurer
                </TableHead>
                <TableHead className="py-3 pl-1 pr-4 w-20 text-center text-white font-bold h-11 border-none">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountInsurers.map((accountInsurer) => (
                <TableRow
                  key={accountInsurer.id}
                  className="transition-all duration-200 border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
                >
                  <TableCell className="py-4 pl-4 pr-1 border-none font-semibold text-slate-800">
                    {insurersMapById[accountInsurer?.insurance]?.name || '-'}
                  </TableCell>
                  <TableCell className="py-4 pl-1 pr-4 text-center border-none">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      className="h-9 w-9 p-0 rounded-full text-slate-600 hover:bg-red-50 hover:!text-red-600 active:!text-red-700 transition-all border border-transparent hover:border-red-100"
                      onClick={() => handleDeleteInsurer(accountInsurer.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};
