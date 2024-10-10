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
import { ChevronLeft, ChevronRight, Plus, Trash, X } from "react-feather";
import { SanctionService } from "@/services/sanction.service";

const SourcePage = () => {
    useRequireAuth();
    const sourceService = new SanctionService();

    const [source, setSource] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedSource, setSelectedSource] = useState<any>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const router = useRouter();

    useEffect(() => {
        sourceService
            .getSourceList(page, rowsPerPage)
            .then((res) => {
                setSource(res.data);
                setTotalItems(res.total);
                setTotalPages(res.pageTotal);
            })
            .catch((error) => {
                console.error("Failed to fetch sources:", error);
            });
    }, [page, rowsPerPage]);

    const handleEditSource = (id: string) => {
        router.push("/source/edit-source/" + id);
    };

    const handleViewDetail = async (id: string) => {
        try {
            const response = await sourceService.getSourceById(id);
            const sanctionData = response.data[0];
            setSelectedSource(sanctionData);
            setDrawerOpen(true);

        } catch (err) {
            console.error("Failed to fetch sanction details:", err);
        }
    };

    const addNewSource = () => {
        router.push("/source/add-source");
    };

      const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this source?")) {
            sourceService
            .deleteDiscSourceById(id)
            .then(() => {
              setSource(
                source.filter((source) => source.id !== id)
              );
            })
            .catch((error) => {
              console.error("Failed to delete source:", error);
            });
        }
      };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Source List</h1>
                <Button
                    onClick={() => addNewSource()}
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 flex items-center justify-center"
                >
                    <Plus className="w-5 h-5 mr-1 " /> Add Source
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Source Name</TableHead>
                        <TableHead>Source Type</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Source URL</TableHead>
                        <TableHead>Insurance ID</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {source.map((source) => (
                        <TableRow key={source.id}>
                            <TableCell>{source.source_name}</TableCell>
                            <TableCell>{source.source_type}</TableCell>
                            <TableCell>{source.country}</TableCell>
                            <TableCell>{source.source_url}</TableCell>
                            <TableCell>{source.insurance_id}</TableCell>
                            <TableCell>
                                <div className="flex space-x-2">

                                    <Drawer direction="right">
                                        <DrawerTrigger
                                            className="bg-[#016DA1] text-white px-4 py-2 rounded-full"
                                            onClick={() => handleViewDetail(source.id)}
                                        >
                                            View
                                        </DrawerTrigger>
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
                                                        <div className="min-w-40 w-40">Source ID</div>
                                                        <div className="max-w-1 w-1">:</div>
                                                        <div>{selectedSource?.id}</div>
                                                    </div>
                                                    <div className="flex gap-2 text-sm font-bold text-[#016DA1]">
                                                        <div className="min-w-40 w-40">Source Details</div>
                                                    </div>
                                                    <div className="flex gap-2 text-sm font-medium">
                                                        <div className="min-w-40 w-40">Source Name</div>
                                                        <div className="max-w-1 w-1">:</div>
                                                        <div>{selectedSource?.source_name}</div>
                                                    </div>
                                                    <div className="flex gap-2 text-sm font-medium">
                                                        <div className="min-w-40 w-40">Type</div>
                                                        <div className="max-w-1 w-1">:</div>
                                                        <div>{selectedSource?.source_type}</div>
                                                    </div>
                                                    <div className="flex gap-2 text-sm font-medium">
                                                        <div className="min-w-40 w-40">Country</div>
                                                        <div className="max-w-1 w-1">:</div>
                                                        <div>{selectedSource?.country}</div>
                                                    </div>
                                                    <div className="flex gap-2 text-sm font-medium">
                                                        <div className="min-w-40 w-40">Source URL</div>
                                                        <div className="max-w-1 w-1">:</div>
                                                        <div>{selectedSource?.source_url}</div>
                                                    </div>
                                                    <div className="flex gap-2 text-sm font-medium">
                                                        <div className="min-w-40 w-40">Insurance ID</div>
                                                        <div className="max-w-1 w-1">:</div>
                                                        <div>{selectedSource?.insurance_id}</div>
                                                    </div>
                                                    <div className="flex gap-2 text-sm font-medium">
                                                        <div className="min-w-40 w-40">Created Date</div>
                                                        <div className="max-w-1 w-1">:</div>
                                                        <div>{selectedSource?.created_at ? format(new Date(selectedSource.created_at), "dd-MM-yyyy") : 'N/A'}</div>
                                                    </div>
                                                    <div className="flex gap-2 text-sm font-medium">
                                                        <div className="min-w-40 w-40">Updated Date</div>
                                                        <div className="max-w-1 w-1">:</div>
                                                        <div>{selectedSource?.updated_at ? format(new Date(selectedSource.updated_at), "dd-MM-yyyy") : 'N/A'}</div>
                                                    </div>

                                                </div>

                                                <div className="flex justify-center mt-4">
                                                    <button
                                                        onClick={() => handleEditSource(source.id)}
                                                        className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 flex items-center justify-center"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        </DrawerContent>
                                    </Drawer>

                                    <Button
                                        variant="ghost"
                                        onClick={() => handleDelete(source.id)}
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
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        const newRowsPerPage = Number(e.target.value);
                                        setRowsPerPage(newRowsPerPage);
                                        setPage(1);
                                    }}
                                >
                                    {[10, 20, 30, 50].map((option) => (
                                        <option key={option} value={option}>
                                            {option}
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

const SourceWithSidebar = (params: any) =>
    WithSidebar(SourcePage)(params);
export default SourceWithSidebar;
