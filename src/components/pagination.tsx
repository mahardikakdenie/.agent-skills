import React, { useState } from "react";
import Select from "@/components/select";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "react-feather";
import {defaultOptionPagination} from "@/constants/app-common.const";

interface PaginationProps {
    totalData: number;
    itemsPerPageOptions?: any[];
    currentPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    limit?: number;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   totalData,
                                                   itemsPerPageOptions = defaultOptionPagination,
                                                   currentPage,
                                                   onPageChange,
                                                   onItemsPerPageChange,
                                                   limit
                                               }) => {
    const [itemsPerPage, setItemsPerPage] = useState(limit ? limit :5);
    const totalPages = Math.ceil(totalData / itemsPerPage);

    const handleItemsPerPageChange = (event: string | number) => {
        const newItemsPerPage = Number(event);
        setItemsPerPage(newItemsPerPage);
        onItemsPerPageChange(newItemsPerPage);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        onPageChange(newPage);
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center p-2 space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                    Showing
                </span>
                <div>
                    <Select value={itemsPerPage} onChange={handleItemsPerPageChange} options={itemsPerPageOptions} />
                </div>
                <span className="text-sm text-gray-700">
                    of {totalData} items
                </span>
            </div>
            <div className="flex items-center space-x-2">
                <div>
                    <ChevronsLeft className={`${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"}`} onClick={() => currentPage !== 1 && handlePageChange(1)} color={`${currentPage === 1 ? "#C4C4C4" : "#58585B"}`} />
                </div>
                <div>
                    <ChevronLeft className={`${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"}`} onClick={() => currentPage !== 1 && handlePageChange(currentPage - 1)} color={`${currentPage === 1 ? "#C4C4C4" : "#58585B"}`} />
                </div>
                <div>
                    <ChevronRight className={`${currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`} onClick={() => currentPage !== totalPages && handlePageChange(currentPage + 1)} color={`${currentPage === totalPages ? "#C4C4C4" : "#58585B"}`} />
                </div>
                <div>
                    <ChevronsRight className={`${currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`} onClick={() => currentPage !== totalPages && handlePageChange(totalPages)} color={`${currentPage === totalPages ? "#C4C4C4" : "#58585B"}`} />
                </div>
            </div>
        </div>
    );
};

export default Pagination;
