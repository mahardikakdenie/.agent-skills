import {getHeaderPage, moneyFormatter, startDateAndEndDateView} from "@/helpers/app.helper";
import React, {useEffect, useState} from "react";
import {useScreen} from "@/context/screen.context";
import {usePathname} from "next/navigation";
import NotFound from "@/components/not-found";
import Pagination from "@/components/pagination";
import {Meta} from "@/types/page";
import CalenderIcon from "@/images/calender.icon";
import {delimiter, primary} from "@/constants/app-common.const";
import Modal from "@/components/modal";
import DatePicker from "@/components/datepicker";
import Button from "@/components/button";
import {transactionService} from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import {Transaction} from "@/types/transaction";
import {useAuth} from "@/context/auth.context";

export const ListTransactionView = () => {
    const {isMobileView, setLoading} = useScreen();
    const path = usePathname();
    const {user, handleResponseError} = useAuth()
    const [listTransaction, setListTransaction] = useState<Transaction[]>([]);
    const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
    const [currentSelectedDate, setCurrentSelectedDate] = useState("");
    const [isFilterDateModal, setIsFilterDateModal] = useState(false);
    const [isSelectedStartDateChange, setIsSelectedStartDateChange] = useState(false);
    const [inputPage, setInputPage] = useState<Meta>({
        page: 1,
        limit: 10,
        total: 0,
        pageTotal: 0
    });
    const channel = user?.channel || undefined
    const findListTransaction = async (from?: string | null, to?: string | null, isClearDateFilter: boolean = false) => {
        setLoading(true);
        try {
            const response = await transactionService.get(ApiURL.transactions, {
                params: {
                    channel,
                    page: inputPage.page,
                    limit: inputPage.limit,
                    from,
                    to
                }
            })
            setListTransaction(response.data.data);
            setInputPage((prevState) => (
                {
                    ...prevState,
                    pageTotal: response.data.pageTotal,
                    total: response.data.total
                }
            ))
        } catch (e) {
            setListTransaction([])
            handleResponseError(e)
        } finally {
            setCurrentSelectedDate(isClearDateFilter ? "" : from && to ? `${from}${delimiter}${to}` : selectedStartDate && selectedEndDate ? `${selectedStartDate}${delimiter}${selectedEndDate}` : `coyy`);
            setLoading(false);
        }

    }

    useEffect(() => {
        if (!isFilterDateModal) findListTransaction(selectedStartDate, selectedEndDate).then().catch()
    }, [inputPage.page, inputPage.limit, isFilterDateModal]);

    const handlePageChange = (newPage: number) => {
        setInputPage((prevState: Meta) => {
            return {
                ...prevState,
                page: newPage
            };
        });
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setInputPage(prevState => ({...prevState, limit: newItemsPerPage}))
    }

    const handleCloseFilterDateModal = async () => {
        if (!!currentSelectedDate) {
            const currentDateValue = currentSelectedDate.split(delimiter);
            const currentStartDateValue = currentDateValue && currentDateValue.length > 1 ? currentDateValue[0] : "";
            const currentEndDateValue = currentDateValue && currentDateValue.length > 1 ? currentDateValue[1] : "";
            setSelectedStartDate(currentStartDateValue);
            setSelectedEndDate(currentEndDateValue);
            setIsFilterDateModal(false);
        } else {
            setSelectedStartDate(null);
            setSelectedEndDate(null);
            setIsFilterDateModal(false);
        }
    };

    const handleClearFilterDate = async () => {
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setIsFilterDateModal(false);
        setInputPage(prev => ({...prev, page: 1}))
    };

    const setFilterDate = (value: string | null, isStartDate: boolean) => {
        if (isStartDate) {
            setSelectedStartDate(value);
            setSelectedEndDate(null);
            setIsSelectedStartDateChange(true);
            setTimeout(() => setIsSelectedStartDateChange(false), 500);
        } else {
            setSelectedEndDate(value);
        }
    };

    const filterDate = async () => {
        setIsFilterDateModal(false);
        setInputPage(prev => ({...prev, page: 1}))
        // await findListTransaction(selectedStartDate, selectedEndDate)
    };
    return (
        <div className="mx-auto py-5 px-7">
            <div
                className="overflow-x-auto sm:scrollable flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
                <p className={`font-bold text-lg ${isMobileView && "mb-2"}`}>{getHeaderPage(2, path, true).pageName}</p>
                <div className="flex flex-col lg:flex-row items-center justify-end">
                    <div className="w-full lg:w-80 mr-0 lg:mr-5 mb-3 lg:mb-0">
                        <div onClick={() => setIsFilterDateModal(true)}
                             className={`shadow bg-white clickable py-2 pl-5 pr-1.5 rounded-md flex items-center justify-between`}>
                            <p className="text-xs">{selectedStartDate && selectedEndDate ? startDateAndEndDateView(selectedStartDate, selectedEndDate) : selectedStartDate ? startDateAndEndDateView(selectedStartDate, selectedStartDate) : "Date"}</p>
                            <div>{CalenderIcon(primary, "30", "30", "0 -4 25 24")}</div>
                        </div>
                    </div>
                </div>
            </div>
            {
                listTransaction.length > 0 ? (
                    <div className="relative bg-white rounded-md shadow-md">
                        <div style={{minHeight: "60vh"}} className="overflow-x-auto sm:scrollable">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No.</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction Code</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Buyer</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan Name</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Currency</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Premium</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction Date</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {listTransaction.map((transaction: Transaction, index) => (
                                    <tr className="hover:bg-gray-50" key={transaction.id || index}>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {((inputPage.page - 1) * inputPage.limit) + index + 1}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {transaction.code || 'N/A'}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {transaction.customer?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {transaction.insurance?.product.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {transaction.insurance?.plan.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                                            {transaction.insurance.currency || 'N/A'}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {moneyFormatter().format(transaction.insurance.premium as number) || 'N/A'}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                                            {transaction.created_at ? startDateAndEndDateView(transaction.created_at, transaction.created_at) : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bottom-0 left-0 right-0 bg-white py-2 px-4 border-t border-t-gray-200">
                            <Pagination totalData={inputPage?.total as number} currentPage={inputPage?.page as number}
                                        onPageChange={handlePageChange} limit={inputPage.limit}
                                        onItemsPerPageChange={handleItemsPerPageChange}/>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center bg-white rounded-md py-20 shadow">
                        <NotFound width={isMobileView && "143"} height={isMobileView && "144"}
                                  size1={isMobileView && "143"} size3={isMobileView && "95"}
                                  viewBox={isMobileView && "0 0 70 70"} text="No transactions data available"
                                  textClassName={isMobileView && "text-xs"}/>
                    </div>
                )
            }
            <Modal isOpen={isFilterDateModal} onClose={handleCloseFilterDateModal} widthClassName="w-full lg:w-[500px]"
                   heightClassName="h-fit">
                <div className="py-6 px-4">
                    <h1 className="font-bold text-lg text-center mb-5">Date Filter</h1>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <DatePicker initialValue={selectedStartDate as string} isWithShadow={false} borderDatePicker="border"
                                    label="Start Date" onSubmit={(value) => setFilterDate(value, true)}
                                    onClear={() => setFilterDate(null, true)}/>
                        <DatePicker initialValue={selectedEndDate as string} isWithShadow={false} borderDatePicker="border"
                                    label="End Date" onSubmit={(value) => setFilterDate(value, false)}
                                    onClear={() => setFilterDate(null, false)} minimumDate={selectedStartDate as string}
                                    isDisabled={!selectedStartDate} isForceClear={isSelectedStartDateChange}/>
                    </div>
                    <div className="flex items-center justify-center text-center">
                        <Button variant="danger" additionalClassName="mr-2" onClick={handleClearFilterDate}><span
                            className="mx-3.5">Clear</span></Button>
                        <Button disabled={!selectedStartDate && !selectedEndDate} onClick={filterDate}>
                            <span
                                className={`mx-3 ${(!selectedStartDate || !selectedEndDate) && "text-white"}`}>
                            Save
                            </span>
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}