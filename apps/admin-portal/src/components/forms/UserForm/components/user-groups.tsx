import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@repo/ui";
import {
  Plus,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  Trash2,
} from "react-feather";
import { useParams } from "react-router-dom";
import { Input } from "@repo/ui";
import { StaticImageData } from "next/image";

export const UserGroups = (props: {
  userGroup: any[];
  selectedUserGroups: string[]; // ✅ Already correct
  handleSelectGroup: (ids: string[]) => void; // ✅ Change from (id: string) to (ids: string[])
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  group: any;
  groupFilter: string;
  setGroupFilter: (filter: string) => void;
  handleFilterGroup: (filter: string) => void;
  isAllSelected: boolean;
  handleSelectAllChange: () => void;
  handleCheckboxChange: (id: string) => void;
  isGroupSelected: (id: string) => boolean;
  rowsPerPageGroup: number;
  handleRowsPerPageChangeGroup: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  totalItemsRoles: number;
  setPageRoles: (value: number | ((prevState: number) => number)) => void;
  page: number;
  totalPages: number;
  noData: StaticImageData;
  handleAddSelectedGroups: () => void;
  handleDeleteSelectedGroup: (id: string) => void;
  id: string;
}) => {
  const {
    groupFilter,
    group,
    userGroup,
    isAllSelected,
    selectedUserGroups,
    handleSelectGroup,
    isModalOpen,
    setIsModalOpen,
    handleSelectAllChange,
    handleCheckboxChange,
    isGroupSelected,
    rowsPerPageGroup,
    handleRowsPerPageChangeGroup,
    totalItemsRoles,
    setPageRoles,
    page,
    totalPages,
    noData,
    handleAddSelectedGroups,
    handleDeleteSelectedGroup,
    setGroupFilter,
    id,
  } = props;

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
      <div className="flex gap-4 items-center">
        <div>
          <div className="text-primary font-bold mb-2">
            User&apos;s Group ({userGroup.length})
          </div>
          <p className="text-sm text-black/60">
            <i>
              All the users in the group will have permissions that are defined
              in the selected group roles
            </i>
          </p>
        </div>
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <DialogTrigger asChild>
            <Button
              color="warning"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full ml-auto w-36"
            >
              <Plus className="w-4 h-4 mr-2" /> Assign Group
            </Button>
          </DialogTrigger>
          <DialogContent
            style={{ zIndex: 100 }}
            className="p-0 w-[1000px] max-w-full overflow-hidden"
          >
            <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
              <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                Select Group
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

            <div className="p-4">
              <div className="grid gap-4 mb-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search"
                    value={groupFilter}
                    onChange={(e) => setGroupFilter(e.target.value)}
                    className="px-4 text-sm border rounded-lg h-11"
                  />
                  <Search className="w-5 h-5 absolute right-3 top-3 text-gray-600" />
                </div>
              </div>

              <Table className="table-claims">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap py-2 w-14">
                      <Input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAllChange}
                        className="w-4 h-4 mx-auto"
                      />
                    </TableHead>
                    <TableHead className="py-2">Group Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.length > 0 ? (
                    group.map((group: any, index: number) => (
                      <TableRow
                        key={index}
                        className="cursor-pointer"
                        onClick={() => handleCheckboxChange(group.id)}
                      >
                        <TableCell align="center">
                          <Input
                            type="checkbox"
                            checked={isGroupSelected(group.id)}
                            className="w-4 h-4"
                          />
                        </TableCell>
                        <TableCell>{group?.name || "-"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="hover:!bg-white">
                      <TableCell colSpan={10}>
                        <div className="flex flex-col gap-4 items-center justify-center py-14">
                          <img alt="no data" src={noData.src} width={200} />
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
                        <label htmlFor="rowsPerPageGroup">Showing:</label>
                        <select
                          id="rowsPerPageGroup"
                          value={rowsPerPageGroup}
                          onChange={handleRowsPerPageChangeGroup}
                          className="p-2 border rounded"
                        >
                          {[10, 20, 30, 50].map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <span className="mr-2">of {totalItemsRoles} items</span>
                        <button
                          onClick={() =>
                            setPageRoles((prevState) =>
                              Math.max(prevState - 1, 1)
                            )
                          }
                          disabled={page === 1}
                          title="Prev"
                        >
                          <ChevronLeft />
                        </button>
                        <button
                          onClick={() =>
                            setPageRoles((prevState) =>
                              Math.min(prevState + 1, totalPages)
                            )
                          }
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
                  onClick={handleAddSelectedGroups}
                >
                  <Check className="w-4 h-4 mr-2" /> Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {userGroup.length > 0 && (
        <div className="w-full bg-white rounded-lg overflow-auto mt-5">
          <Table className="table-search-params">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap py-2 w-52">
                  Group
                </TableHead>
                <TableHead className="py-2">Role</TableHead>
                <TableHead className="py-2"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userGroup.map((group, index) => (
                <TableRow key={index}>
                  <TableCell className="py-1">
                    {group?.groups?.name || "-"}
                  </TableCell>
                  <TableCell className="py-1">
                    <div className="flex flex-wrap gap-2">
                      {group?.groups?.group_roles?.length > 0
                        ? group.groups.group_roles.map(
                            (groupRole: any, indexY: number) => (
                              <span
                                key={indexY}
                                className="border border-gray-300 bg-gray-100 rounded py-1 px-2"
                              >
                                {groupRole.roles?.name || "-"}
                              </span>
                            )
                          )
                        : "-"}
                    </div>
                  </TableCell>
                  <TableCell className="py-1 text-center">
                    <Button
                      className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteSelectedGroup(group.id);
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
    </div>
  );
};
