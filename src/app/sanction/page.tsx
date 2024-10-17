"use client";
import WithSidebar from "@/hoc/with-sidebar";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drewer";
import useRequireAuth from "@/hooks/useRequireAuth";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Trash, X, Search } from "react-feather";
import { SanctionService } from "@/services/sanction.service";

const SanctionPage = () => {
    useRequireAuth();
    const sanctionService = new SanctionService();

    const [sanction, setSanction] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedSanction, setSelectedSanction] = useState<any>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [filteredSanction, setFilteredSanction] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input

    const router = useRouter();

    useEffect(() => {
        sanctionService
            .getSanctionList(page, rowsPerPage)
            .then((res) => {
                setSanction(res.data);
                setFilteredSanction(res.data); // Initialize with all sanctions
                setTotalItems(res.total);
                setTotalPages(res.pageTotal);
            })
            .catch((error) => {
                console.error("Failed to fetch sanction:", error);
            });
    }, [page, rowsPerPage]);

    const handleEditSanction = (id: string) => {
        router.push("/sanction/edit-sanction/" + id);
    };

    const handleViewDetail = async (id: string) => {
        try {
            const response = await sanctionService.getSanctionById(id);
            const sanctionData = response.data[0];
            setSelectedSanction(sanctionData);
            setDrawerOpen(true);

        } catch (err) {
            console.error("Failed to fetch sanction details:", err);
        }
    };

    const addNewSanction = () => {
        router.push("/sanction/add-sanction");
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        // Filter sanctions based on searchTerm
        const filtered = sanction.filter((item) => {
            const {
                first_name,
                middle_name,
                last_name,
                date_blacklisted,
                phone_number,
                email,
                country,
                blacklist_reason,
            } = item;

            // Format the date_blacklisted to "dd-MM-yyyy"
            const formattedDate = date_blacklisted ? format(new Date(date_blacklisted), "dd-MM-yyyy") : "";

            return (
                first_name?.toLowerCase().includes(value) ||
                middle_name?.toLowerCase().includes(value) ||
                last_name?.toLowerCase().includes(value) ||
                formattedDate.includes(value) || // Search date using formatted date
                phone_number?.toLowerCase().includes(value) ||
                email?.toLowerCase().includes(value) ||
                country?.toLowerCase().includes(value) ||
                blacklist_reason?.toLowerCase().includes(value)
            );
        });

        setFilteredSanction(filtered);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this sanction?")) {
            sanctionService
                .deleteDiscSanctionById(id)
                .then(() => {
                    setSanction(
                        sanction.filter((sanction) => sanction.id !== id)
                    );
                })
                .catch((error) => {
                    console.error("Failed to delete sanction:", error);
                });
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Sanction List</h1>
                <Button
                    onClick={() => addNewSanction()}
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 flex items-center justify-center"
                >
                    <Plus className="w-5 h-5 mr-1 " /> Add Sanction
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-full w-full mb-4 ml-auto shadow-sm">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search"
                    className="border p-3 rounded-md pr-10 w-full"
                />
                <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#016da1]" />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Blacklist Reason</TableHead>
                        <TableHead>Blacklisted Date</TableHead>
                        <TableHead>Country</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* <TableBody> */}
                    {filteredSanction.map((sanction) => (
                        <TableRow key={sanction.id}>
                            <TableCell>{sanction.first_name} {sanction.middle_name} {sanction.last_name}</TableCell>
                            <TableCell>{sanction.phone_number}</TableCell>
                            <TableCell>{sanction.blacklist_reason}</TableCell>
                            <TableCell>{format(new Date(sanction.date_blacklisted), "dd-MM-yyyy")}</TableCell>
                            <TableCell>{sanction.country}</TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Drawer direction="right">
                                        <DrawerTrigger
                                            className="bg-[#016DA1] text-white px-4 py-2 rounded-full"
                                            onClick={() => handleViewDetail(sanction.id)}
                                        >
                                            View
                                        </DrawerTrigger>
                                        <DrawerContent>
                                            <DrawerContent>
                                                <DrawerHeader>
                                                    <DrawerClose className="absolute right-2 top-2">
                                                        <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
                                                            <X />
                                                        </Button>
                                                    </DrawerClose>
                                                    <DrawerTitle className="text-black font-bold text-2xl">
                                                        Details
                                                    </DrawerTitle>
                                                </DrawerHeader>
                                                <div className="flex flex-col w-full h-full p-4 md:p-6 bg-[#F8F8F8] mt-5 rounded-xl overflow-y-auto">
                                                    <div className="rounded-lg flex flex-col gap-4 text-black">
                                                        <div className="flex gap-2 text-sm font-medium">
                                                            <div className="min-w-40 w-40">Sanction ID</div>
                                                            <div className="max-w-1 w-1">:</div>
                                                            <div>{selectedSanction?.id}</div>
                                                        </div>
                                                        <div className="flex gap-2 text-sm font-bold text-[#016DA1]">
                                                            <div className="min-w-40 w-40">Identity Details</div>
                                                        </div>
                                                        <div className="flex gap-2 text-sm font-medium">
                                                            <div className="min-w-40 w-40">Name</div>
                                                            <div className="max-w-1 w-1">:</div>
                                                            <div>{selectedSanction?.first_name} {selectedSanction?.middle_name} {selectedSanction?.last_name}</div>
                                                        </div>
                                                        <div className="flex gap-2 text-sm font-bold text-[#016DA1]">
                                                            <div className="min-w-40 w-40">Personal Details</div>
                                                        </div>
                                                        <div className="flex gap-2 text-sm font-medium">
                                                            <div className="min-w-40 w-40">ID Number</div>
                                                            <div className="max-w-1 w-1">:</div>
                                                            <div>{selectedSanction?.id_number}</div>
                                                        </div>
                                                        <div className="flex gap-2 text-sm font-medium">
                                                            <div className="min-w-40 w-40">Phone Number</div>
                                                            <div className="max-w-1 w-1">:</div>
                                                            <div>{selectedSanction?.phone_number}</div>
                                                        </div>
                                                        <div className="flex gap-2 text-sm font-medium">
                                                            <div className="min-w-40 w-40">Email</div>
                                                            <div className="max-w-1 w-1">:</div>
                                                            <div>{selectedSanction?.email}</div>
                                                        </div>
                                                        <div className="flex gap-2 text-sm font-bold text-[#016DA1]">
                                                            <div className="min-w-40 w-40">Details</div>
                                                        </div>
                                                        <div className="flex gap-2 text-sm font-medium">
                                                            <div className="min-w-40 w-40">Blacklisted Date</div>
                                                            <div className="max-w-1 w-1">:</div>
                                                            <div>{selectedSanction?.date_blacklisted ? format(new Date(selectedSanction.date_blacklisted), "dd-MM-yyyy") : 'N/A'}</div>
                                                        </div>
                                                        <div className="flex gap-2 text-sm font-medium">
                                                            <div className="min-w-40 w-40">Blacklisted Reason</div>
                                                            <div className="max-w-1 w-1">:</div>
                                                            <div>{selectedSanction?.blacklist_reason}</div>
                                                        </div>
                                                        <div className="flex gap-2 text-sm font-medium">
                                                            <div className="min-w-40 w-40">Created At</div>
                                                            <div className="max-w-1 w-1">:</div>
                                                            <div>{selectedSanction?.created_at ? format(new Date(selectedSanction.created_at), "dd-MM-yyyy") : 'N/A'}</div>
                                                        </div>
                                                        <div className="flex gap-2 text-sm font-medium">
                                                            <div className="min-w-40 w-40">Updated At</div>
                                                            <div className="max-w-1 w-1">:</div>
                                                            <div>{selectedSanction?.updated_at ? format(new Date(selectedSanction.updated_at), "dd-MM-yyyy") : 'N/A'}</div>
                                                        </div>

                                                    </div>

                                                    <div className="flex justify-center mt-4">
                                                        <button
                                                            onClick={() => handleEditSanction(sanction.id)}
                                                            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 flex items-center justify-center"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            </DrawerContent>
                                        </DrawerContent>
                                    </Drawer>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleDelete(sanction.id)}
                                        className="text-red-600 px-0"
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={8}>
                            <div className="flex justify-center items-center gap-2 font-normal">
                                <label htmlFor="rowsPerPage">Showing:</label>
                                <select
                                    id="rowsPerPage"
                                    className="p-2 border rounded"
                                    value={rowsPerPage === totalItems ? 'All' : rowsPerPage}
                                    onChange={(e) => {
                                        const newRowsPerPage = e.target.value === 'All' ? totalItems : Number(e.target.value);
                                        setRowsPerPage(newRowsPerPage);
                                        setPage(1); // Reset to the first page whenever the rows per page change
                                    }}
                                >
                                    {[10, 20, 30, 50, 'All'].map((option) => (
                                        <option key={option} value={option === 'All' ? 'All' : option}>
                                            {option === 'All' ? 'Show All' : option}
                                        </option>
                                    ))}
                                </select>
                                <span className="mr-2">of {totalItems} items</span>
                                <button
                                    onClick={() => {
                                        if (page > 1) {
                                            setPage(page - 1);
                                        }
                                    }}
                                    disabled={page === 1}
                                    title="Previous"
                                >
                                    <ChevronLeft />
                                </button>
                                <button
                                    onClick={() => {
                                        if (page < totalPages) {
                                            setPage(page + 1);
                                        }
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
    );
};

const SanctionWithSidebar = (params: any) =>
    WithSidebar(SanctionPage)(params);
export default SanctionWithSidebar;
