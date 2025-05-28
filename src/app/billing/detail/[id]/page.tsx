"use client";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import { useEffect, useState } from "react";
import { useBilling } from "../../hook";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/formatter";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/context/loading.context";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductCategoriesService } from "@/services/masterdata/product-category.service";

const DetailBillingPage = () => {
  useRequireAuth();

  const { getBillingById, billing, updateBilling } = useBilling();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const { setLoading } = useLoading();
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
    router.push("/billing");
  };

  const handleUpdateToPaid = async () => {
    try {
      setLoading(true);
      await updateBilling(id as string, { status: "paid" });
      setLoading(false);
      alert("Status updated to paid");
      router.push("/billing");
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
      router.push("/billing");
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
  return (
    billing.data && (
      <div className="flex flex-col w-full">
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/billing">Billing</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{billing.data[0].items[0].billings.type == "insurer" ? "Billing Detail" : "Listing Detail"}</BreadcrumbPage>
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
            <Button
              onClick={() => router.push(`/billing/detail/${id}/export?type=${billing.data[0].items[0].billings.type}`)}
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

              {billing.data[0].items[0].billings.status === "waiting-for-payment" && (
                <div className="pt-5 flex flex-row gap-3">
                  <Button
                    onClick={() => setOpenUpdateToPaid(true)}
                    className="rounded-full bg-green-600 hover:bg-green-700"
                  >
                    <span className="flex items-center">✓ Mark as Paid</span>
                  </Button>

                  <Button
                    onClick={() => router.push(`/billing/detail/${id}/invoice?type=${billing.data[0].items[0].billings.type}`)}
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

const DetailBillingWithSidebar = (params: any) =>
  WithSidebar(DetailBillingPage)(params);
export default DetailBillingWithSidebar;
