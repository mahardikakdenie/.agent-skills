import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter, Table } from "@/components/ui/table";
import { AlertCircle, Check, ChevronLeft, ChevronRight, Plus, Search, Trash2, X } from "react-feather";
import { Input } from "@/components/ui/input";
import Image, { StaticImageData } from "next/image";
import { useParams } from "react-router-dom";

export const UserRoles = (props: {
  groupRole: any[];
  isModalOpenUser: boolean;
  setIsModalOpenUser: (open: boolean) => void;
  handleSelectRole: (id: string) => void;
  userFilter: string;
  handleSearch: (value: string) => void;
  isAllSelectedRole: boolean;
  handleSelectAllChangeRole: () => void;
  dataRole: any[];
  handleCheckboxChangeRole: (id: string) => void;
  isUserSelected: (id: string) => boolean;
  noData: StaticImageData;
  rowsPerPage: number;
  handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  totalItemsUser: number;
  page: number;
  selectRole: (page: number) => void;
  setPage: (value: number | ((prevState: number) => number)) => void;
  totalPages: number;
  handleAddSelectedRole: () => void;
  handleDeleteSelectedRole: (id: string) => void;
  id: string;
}) => {
  const {
    groupRole,
    isModalOpenUser,
    setIsModalOpenUser,
    handleSelectRole,
    userFilter,
    handleSearch,
    isAllSelectedRole,
    handleSelectAllChangeRole,
    dataRole,
    handleCheckboxChangeRole,
    isUserSelected,
    noData,
    rowsPerPage,
    handleRowsPerPageChange,
    totalItemsUser,
    page,
    selectRole,
    setPage,
    totalPages,
    handleAddSelectedRole,
    handleDeleteSelectedRole,
    id
  } = props;

  return <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
    <div className="flex gap-4 items-center mt-6">
      <div>
        <div className="text-primary font-bold mb-2">
          Additional Role ({groupRole.length})
        </div>
        <p className="text-sm text-black/60">
          <i>
            Assigned users to specific roles. If you are unable to find
            the one you require, please request the superadmin to create
            a new role
          </i>
        </p>
      </div>
      <Dialog
        open={isModalOpenUser}
        onOpenChange={(open) => {
          setIsModalOpenUser(open);
        }}
      >
        <DialogTrigger asChild>
          <Button
            color="warning"
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full ml-auto w-36"
            onClick={() => id && handleSelectRole(id)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Role
          </Button>
        </DialogTrigger>
        <DialogContent
          style={{ zIndex: 100 }}
          className="p-0 w-[1000px] max-w-full overflow-hidden"
        >
          <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
            <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
              Select Role
              <DialogClose className="ml-auto">
                <Button
                  type="button"
                  className="bg-transparent hover:bg-transparent text-black p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>

          <div
            className="p-4 overflow-auto"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search"
                  value={userFilter}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="px-4 text-sm border rounded-lg h-11"
                />
                <Search className="w-5 h-5 absolute right-3 top-3 text-gray-600" />
              </div>
              <div className="flex gap-4 italic text-xs items-center font-light bg-white shadow rounded py-2 px-4">
                <AlertCircle
                  className="text-blue-600"
                  width="35"
                  height="35"
                />
                Assigned users to specific roles. If you are unable to
                find the one you require, please request the superadmin
                to create a new role
              </div>
            </div>

            <Table className="table-claims">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap py-2 w-14">
                    <Input
                      type="checkbox"
                      checked={isAllSelectedRole}
                      onChange={handleSelectAllChangeRole}
                      className="w-4 h-4 mx-auto"
                    />
                  </TableHead>
                  <TableHead className="py-2">Role Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataRole.length > 0 ? (
                  dataRole.map((role) => (
                    <TableRow
                      key={role.id}
                      className="cursor-pointer"
                      onClick={() => handleCheckboxChangeRole(role.id)}
                    >
                      <TableCell align="center">
                        <Input
                          type="checkbox"
                          checked={isUserSelected(role.id)}
                          className="w-4 h-4"
                        />
                      </TableCell>
                      <TableCell>
                        {role.name
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (char: any) =>
                            char.toUpperCase()
                          ) || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:!bg-white">
                    <TableCell colSpan={4}>
                      <div className="flex flex-col gap-4 items-center justify-center py-14">
                        <Image alt="no data" src={noData} width={200} />
                        No transaction data available
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex justify-center items-center gap-2 font-normal">
                      <label htmlFor="rowsPerPage">Showing:</label>
                      <select
                        id="rowsPerPage"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        className="p-2 border rounded"
                      >
                        {[10, 20, 30, 50].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <span className="mr-2">
                        of {totalItemsUser} items
                      </span>
                      <button
                        onClick={() => {
                          selectRole(page - 1);
                          setPage((prevState) =>
                            Math.max(prevState - 1, 1)
                          );
                        }}
                        disabled={page === 1}
                        title="Prev"
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        onClick={() => {
                          selectRole(page + 1);
                          setPage((prevState) =>
                            Math.min(prevState + 1, totalPages)
                          );
                        }}
                        disabled={page === totalPages}
                        title="Next"
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <DialogFooter className="sm:justify-center justify-center pb-4 sm:pb-6">
            <DialogClose asChild>
              <Button
                type="button"
                className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                onClick={handleAddSelectedRole}
              >
                <Check className="w-4 h-4 mr-2" /> Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    {groupRole.length > 0 && (
      <div className="w-full bg-white rounded-lg overflow-auto mt-5">
        <Table className="table-search-params">
          <TableHeader>
            <TableRow>
              <TableHead className="py-2">Name</TableHead>
              <TableHead className="py-2 w-10">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupRole.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="py-1">
                  {role?.roles?.name
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (char: any) =>
                      char.toUpperCase()
                    ) || "-"}
                </TableCell>
                <TableCell className="py-1 text-center">
                  <Button
                    className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteSelectedRole(role.id);
                    }}
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