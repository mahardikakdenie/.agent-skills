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
    <Box className="p-4 sm:p-6 bg-white rounded-lg gap-4">
      <Box className="flex justify-between items-start mb-4">
        <Box>
          <Box className="text-primary font-bold mb-2">
            User&apos;s Insurers ({accountInsurers.length})
          </Box>
          <Box as="p" className="text-sm text-black/60">
            <i>
              Assigned insurers for this user. These insurers determine which insurance products the
              user can access.
            </i>
          </Box>
        </Box>
        <Button
          color="warning"
          type="button"
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full w-36"
          onClick={() => setIsInsurerModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Insurer
        </Button>
      </Box>

      {accountInsurers.length > 0 && insurers.length > 0 && (
        <Box className="w-full bg-white rounded-lg overflow-auto">
          <Table className="table-search-params">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap py-2">Insurer</TableHead>
                <TableHead className="py-2"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountInsurers.map((accountInsurer) => (
                <TableRow key={accountInsurer.id}>
                  <TableCell className="py-1">
                    {insurersMapById[accountInsurer?.insurance]?.name || '-'}
                  </TableCell>
                  <TableCell className="py-1 text-center">
                    <Button
                      type="button"
                      className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
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
