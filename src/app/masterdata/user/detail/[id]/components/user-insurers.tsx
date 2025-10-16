import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "react-feather";

interface UserInsurersProps {
  accountInsurers: Array<{
    id: string;
    insurance: string;
  }>;
  insurers: Array<any>;
  insurersMapById: Record<string, { name: string; }>;
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
  return <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="text-primary font-bold mb-2">
          User&apos;s Insurers ({accountInsurers.length})
        </div>
        <p className="text-sm text-black/60">
          <i>
            Assigned insurers for this user. These insurers determine which insurance products the user can access.
          </i>
        </p>
      </div>
      <Button
        color="warning"
        type="button"
        className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full w-36"
        onClick={() => setIsInsurerModalOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" /> Add Insurer
      </Button>
    </div>

    {accountInsurers.length > 0 && insurers.length > 0 && (
      <div className="w-full bg-white rounded-lg overflow-auto">
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
                  {insurersMapById[accountInsurer?.insurance]?.name || "-"}
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
      </div>
    )}
  </div>;
};
