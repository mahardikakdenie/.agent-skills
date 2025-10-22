// "use client";
//
// import React from "react";
// import {FinanceBillingDetailView} from "@/views/finance/billing/detail/detail.view";
//
// export default function FinanceBillingDetailPage() {
//     return <FinanceBillingDetailView />;
// }

"use client";
import { useEffect, useState } from "react";
import { useBilling } from "@/app/finance/billing/hook";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Download, Upload, X } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/formatter";
import {useParams, usePathname, useRouter} from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {useScreen} from "@/context/screen.context";
import AppURL from "@/constants/app-url.const";

export default function DetailBillingPage() {
    const { getBillingById, billing, updateBilling, confirmReconcilliation } = useBilling();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const { setLoading } = useScreen();
    const [openCancel, setOpenCancel] = useState(false);
    const [openUpdateToPaid, setOpenUpdateToPaid] = useState(false);

    const [searchCategory, setSearchCategory] = useState("All");
    const [categories, setCategories] = useState<any[]>([]);

    const handleCategoryChange = (v: string) => {
        setSearchCategory(v);

    };

    const getCategories = async () => {
        let data = [];
        if (billing && billing.data) {
            for (let i = 0; i < billing.data.length; i++) {
                let element = billing.data[i];
                element.product_name = billing.data[i].items[0].details.product_name;//SET PRODUCT NAME
                data.push(element);
            }
            setCategories(data);
        }
    }

    const handleRowsPerPageChange = (e: any) => {
        setRowsPerPage(e.target.value);
    };

    const { id } = useParams();

    const handlePaging = (page: number) => {
        setPage(page);
        (async () => {
            const search = {
                status: "Declaration",
                limit: rowsPerPage,
            };

            await getBillingById(id as string, page, rowsPerPage, "product");
        })();
    };

    useEffect(() => {
        getBillingById(id as string, 1, rowsPerPage, "product")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, rowsPerPage]);

    useEffect(() => {
        getCategories();
    }, [billing]);

    const router = useRouter();
    const handleBack = () => {
        router.push(AppURL.financeBilling);
    };

    const handleUpdateToPaid = async () => {
        try {
            setLoading(true);
            await updateBilling(id as string, { status: "paid" });
            setLoading(false);
            alert("Status updated to paid");
            router.push(AppURL.financeBilling);
        } catch (error) {
            setLoading(false);
            console.error("Request failed:", error);
            alert("Failed to update status paid");
        }
    };

    const handleCancel = () => {
        try {
            setLoading(true);

            updateBilling(id as string, {
                status: "cancelled",
                deleted_at: new Date(),
            });
            alert("Status update to cancelled");
            setLoading(false);
            router.push(AppURL.financeBilling);
        } catch (error) {
            setLoading(false);
            console.error("Request failed:", error);
            alert("Failed change status to cancel");
        }
    };

    const getData = () => {
        let dataFilter: any[] = [];
        if (searchCategory == "All") {
            for (let i = 0; i < billing.data.length; i++) {
                const element = billing.data[i];
                for (let j = 0; j < element.items.length; j++) {
                    const d = element.items[j];
                    dataFilter.push(d);
                }
            }
        } else {
            dataFilter = billing.data?.filter((x: { product: string; }) => { if (searchCategory != "All") return x.product == searchCategory; else { return x } })[0].items;
        }
        try {
            dataFilter.sort((a, b) => {
                return new Date(b.details?.transaction_date).getTime() - new Date(a.details?.transaction_date).getTime();
            });
        } catch (error) {
            console.log("Error get transaction date")
        }

        return dataFilter;
    }

    const getTotalTransaction = () => {
        let totalTransaction = 0;
        for (let i = 0; i < billing.data.length; i++) {
            const element = billing.data[i];
            totalTransaction += element.items.length;
        }
        return totalTransaction;
    }
    const getStatusColor = (status: string) => {
        if (status == "waiting-for-payment") {
            return "#CC9B36";
        }
        else if (status == "paid") {
            return "#00AB4F";
        }
        else if (status == "cancel") {
            return "red";
        }
        return "";
    }
    const getStatusReconcilliationColor = (status: string) => {
        if (status == "not-matched") {
            return "#d27979";
        }
        else if (status == "matched") {
            return "#64a864";
        }
        return "";
    }

    const confirmReconcilliationHandler = async (id: string) => {
        try {
            setLoading(true);
            await confirmReconcilliation(id);
            await getBillingById(id as string, 1, rowsPerPage, "product")
            setLoading(false);
            alert("Reconcilliation confirmed successfully");
        } catch (error) {
            setLoading(false);
            console.error("Request failed:", error);
            alert("Failed to confirm reconcilliation");
        }
    }

    return (
        billing.data && (
            <div className="flex flex-col w-full">
                <div className="bg-white md:px-6 p-4 flex items-center">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={AppURL.financeBilling}>Billing</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{billing.data[0]?.items[0].billings.type == "insurer" ? "Billing Detail" : "Listing Detail"}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
                            {billing.data[0].items[0].billings.type == "insurer" ? "Billing Detail" : "Listing Detail"}
                        </h2>
                    </div>
                    <div className="flex space-x-4 ml-auto">
                        <div
                            onClick={handleBack}
                            className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </div>
                        {billing.data[0].items[0].billings.status === "pending-reconcilliation" && (
                            <Button onClick={() => router.push(`${AppURL.financeBillingDetail}/${id}/import?type=${billing.data[0].items[0].billings.type}`)} className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full">
                                <Upload className="w-5 h-5 mr-1" /> Import Reconcilliation
                            </Button>)
                        }
                        <Button
                            onClick={() => router.push(`${AppURL.financeBillingDetail}/${id}/export?type=${billing.data[0].items[0].billings.type}`)}
                            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
                        >
                            <Download className="w-5 h-5 mr-1 " /> Export
                        </Button>
                    </div>
                </div>

                <div className="pt-5 md:px-6 p-4 m-5 bg-white">
                    <table width="100%">
                        <tbody>
                        <tr>
                            <td>Billing No</td>
                            <td>: {billing.data[0].items[0].billings.billing_no}</td>
                            <td>Type</td>
                            <td>: {billing.data[0].items[0].billings.type}</td>
                        </tr>
                        <tr>
                            <td>Created Date</td>
                            <td>: {new Date(billing.data[0].items[0].billings.created_at).toDateString()}</td>
                            <td>Company Name</td>
                            <td>: {billing.data[0].items[0].billings.company_name}</td>
                        </tr>
                        <tr>
                            <td>{billing.data[0].items[0].billings.type == "insurer" ? "Total Transaction Amount" : "Total Net Premium"}</td>
                            <td>: {billing.data[0].items[0].billings.currency} {formatMoney(billing.data[0].items[0].billings.type == "insurer" ?
                                billing.data[0].items[0].billings.total : (billing.data[0].items[0].billings.total - billing.data[0].items[0].billings.amount))}</td>
                            <td>Period</td>
                            <td>: {billing.data[0].items[0].billings.transaction_period}</td>
                        </tr>
                        <tr>
                            {
                                billing.data[0].items[0].billings.type == "insurer" ? <>
                                        <td>Total Commision Amount</td>
                                        <td>: {billing.data[0].items[0].billings.currency} {formatMoney(billing.data[0].items[0].billings.amount)}</td>
                                    </>
                                    :
                                    ""}
                            <td>Status</td>
                            <td className={`font-bold`} style={{ color: `${getStatusColor(billing.data[0].items[0].billings.status)}` }}>: {billing.data[0].items[0].billings.status
                                .split("-")
                                .map(
                                    (word: any) =>
                                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                )
                                .join(" ")}</td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="pt-5">
                        <div>
                            {/* <div>Billing No. {billing.data[0].items[0].billings.billing_no}</div>
              <div>
                Total Transaction:{" "}
                {getTotalTransaction()}
              </div>
              <div>
                Total Transaction Amount:{" "}
                {formatMoney(billing.data[0].items[0].billings.total)}
              </div>
              <div>
                Total Commission Amount:{" "}
                {formatMoney(billing.data[0].items[0].billings.amount)}
              </div>
              <div>
                Billing Created Date:{" "}
                {new Date(billing.data[0].items[0].billings.created_at).toDateString()}
              </div>
              <div>
                Status:{" "}
                {billing.data[0].items[0].billings.status
                  .split("-")
                  .map(
                    (word: any) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ")}
              </div>
              <div>Type: {billing.data[0].items[0].billings.type}</div>
              <div>Company Name: {billing.data[0].items[0].billings.company_name}</div>
              <div>Period: {billing.data[0].items[0].billings.transaction_period}</div> */}

                            {["waiting-for-payment", "pending-reconcilliation"].includes(billing.data[0].items[0].billings.status) && (
                                <div className="pt-5 flex flex-row gap-3">
                                    <Button
                                        onClick={() => setOpenUpdateToPaid(true)}
                                        disabled={billing.data[0].items[0].billings.status !== "waiting-for-payment"}
                                        className="rounded-full bg-green-600 hover:bg-green-700"
                                    >
                                        <span className="flex items-center">✓ Mark as Paid</span>
                                    </Button>

                                    <Button
                                        onClick={() => router.push(`${AppURL.financeBillingDetail}/${id}/invoice?type=${billing.data[0].items[0].billings.type}`)}
                                        className="rounded-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        <span className="flex items-center">{billing.data[0].items[0].billings.type == "insurer" ? "📄 View Invoice" : "📄 View Billing Listing"}</span>
                                    </Button>

                                    <Button
                                        onClick={() => setOpenCancel(true)}
                                        variant="destructive"
                                        className="rounded-full bg-white border text-red-700 border-red-700 hover:bg-red-700 hover:text-white"
                                    >
                                        <span className="flex items-center">{billing.data[0].items[0].billings.type == "insurer" ? "✕ Cancel Billing" : "✕ Cancel Listing"}</span>
                                    </Button>
                                    { billing.data[0].items[0].status_reconcilliation && billing.data[0].items[0].billings.status === "pending-reconcilliation"  && (
                                        (() => {
                                            // Check if at least one item has status_reconcilliation === 'matched'
                                            const hasMatched = billing.data.some((cat: any) =>
                                                cat.items.some((item: any) => item.status_reconcilliation === 'matched')
                                            );
                                            return (
                                                <Button
                                                    onClick={() => confirmReconcilliationHandler(billing.data[0].items[0].billings.id)}
                                                    variant="destructive"
                                                    className="rounded-full  hover:bg-green-700"
                                                    style={{ backgroundColor: `#64a864` }}
                                                    disabled={!hasMatched}
                                                >
                                                    <span className="flex items-center">✓ Confirm Reconcilliation</span>
                                                </Button>
                                            );
                                        })()
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-5 md:px-6 p-4 m-5 bg-white">
                    {/* <div className="flex flex-wrap justify-start gap-4 pb-4 items-center">
            <div className="min-w-48">
              <Select
                value={searchCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={'All'} key={-1}>All Product</SelectItem>
                    {
                      categories.map((item, index) => (
                        <SelectItem key={index} value={item.product}>{item.product_name}</SelectItem>
                      ))
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div> */}
                    <div>
                        <Table className="table-claims w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead style={{ width: "180px" }}>Transaction Number</TableHead>
                                    <TableHead style={{}}>Plan Name</TableHead>
                                    {billing.data[0].items[0].billings.type == "partner" ?
                                        <TableHead>Insurance Company Name</TableHead>
                                        : ""}

                                    <TableHead style={{ width: "180px" }}>Transaction Date</TableHead>
                                    <TableHead style={{ width: "50px" }}>Currency</TableHead>

                                    <TableHead style={{ textAlign: "right", width: "120px" }}>Premium</TableHead>

                                    {/* {billing.data[0].items[0].billings.type == "insurer" ? */}
                                    <TableHead style={{ textAlign: "right", width: "30px" }}>%</TableHead>
                                    {/* : ""} */}

                                    {billing.data[0].items[0].billings.type == "insurer" ?
                                        <TableHead style={{ textAlign: "right", width: "150px" }}>Commision Amount</TableHead>
                                        : <TableHead style={{ textAlign: "right", width: "150px" }}>Net Premium</TableHead>}

                                    <TableHead style={{ width: "120px" }}>Status Reconcilliation</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    getData().map((data: any) => {
                                        return (
                                            <TableRow key={data.id}>
                                                <TableCell>{data.invoice_no}</TableCell>
                                                <TableCell>
                                                    {data.details?.plan_name.split("|").join("\n")}
                                                </TableCell>
                                                {billing.data[0].items[0].billings.type == "partner" ?
                                                    <TableCell>{data.details?.insurance_name}</TableCell>
                                                    : ""}

                                                <TableCell>{formatDate(data.details?.transaction_date, "YYYY-MM-DD")}</TableCell>
                                                <TableCell style={{}}>{billing.data[0].items[0].billings.currency}</TableCell>
                                                <TableCell style={{ textAlign: "right" }}>{formatMoney(data.amount)}</TableCell>

                                                {/* {billing.data[0].items[0].billings.type == "insurer" ? */}
                                                <TableCell style={{ textAlign: "right" }}>{data.commission_percentage ?? 0}%</TableCell>
                                                {/* : ""} */}

                                                {billing.data[0].items[0].billings.type == "insurer" ?
                                                    <TableCell style={{ textAlign: "right" }}> {formatMoney(data.commission_amount ?? 0)} </TableCell>
                                                    :
                                                    <TableCell style={{ textAlign: "right" }}> {formatMoney(data.amount - (data.commission_amount ?? 0))} </TableCell>}
                                                <TableCell className={`font-bold`} style={{ color: `${getStatusReconcilliationColor(data.status_reconcilliation)}` }}>
                                                    {data.status_reconcilliation?.split("-").map((word: any) =>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={10}>
                                        <div className="flex justify-center items-center gap-2 font-normal">
                                            <label htmlFor="rowsPerPage">Showing:</label>
                                            <select
                                                id="rowsPerPage"
                                                value={rowsPerPage}
                                                onChange={handleRowsPerPageChange}
                                                className="p-2 border rounded"
                                            >
                                                {[10, 20, 30, 50, 100].map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="mr-2">
                        of {billing.meta?.total} items
                      </span>
                                            <button
                                                onClick={() => handlePaging(page - 1)}
                                                disabled={page === 1}
                                                title="Prev"
                                            >
                                                <ChevronLeft />
                                            </button>
                                            <button
                                                onClick={() => handlePaging(page + 1)}
                                                disabled={page === billing.meta?.pageTotal}
                                                title="Next"
                                            >
                                                <ChevronRight />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                        <Dialog open={openUpdateToPaid} onOpenChange={setOpenUpdateToPaid}>
                            <DialogContent className="p-0 w-[500px] max-w-full overflow-hidden">
                                <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                                    <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                                        Update to Paid
                                        <DialogFooter className="ml-auto">
                                            <Button
                                                type="button"
                                                className="bg-transparent hover:bg-transparent text-black p-0"
                                                onClick={() => setOpenUpdateToPaid(false)}
                                            >
                                                <X className="w-5 h-5" />
                                            </Button>
                                        </DialogFooter>
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="p-4">
                                    <p>Are you sure you want to update to paid?</p>
                                    <div className="flex justify-end mt-5">
                                        <Button
                                            className="btn btn-primary"
                                            onClick={handleUpdateToPaid}
                                        >
                                            Paid
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={openCancel} onOpenChange={setOpenCancel}>
                            <DialogContent className="p-0 w-[500px] max-w-full overflow-hidden">
                                <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                                    <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                                        {billing.data[0].items[0].billings.type == "insurer" ? "Cancel Billing" : "Cancel Listing"}
                                        <DialogFooter className="ml-auto">
                                            <Button
                                                type="button"
                                                className="bg-transparent hover:bg-transparent text-black p-0"
                                                onClick={() => setOpenCancel(false)}
                                            >
                                                <X className="w-5 h-5" />
                                            </Button>
                                        </DialogFooter>
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="p-4">
                                    <p>{billing.data[0].items[0].billings.type == "insurer" ? "Are you sure you want to cancel this billing?" : "Are you sure you want to cancel this listing?"}</p>
                                    <div className="flex justify-end mt-5">
                                        <Button
                                            className="btn btn-primary"
                                            variant={"destructive"}
                                            onClick={handleCancel}
                                        >
                                            {billing.data[0].items[0].billings.type == "insurer" ? "Cancel Billing" : "Cancel Listing"}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        )
    );
};