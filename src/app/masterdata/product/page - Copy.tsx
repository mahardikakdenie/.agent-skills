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
import useRequireAuth from "@/hooks/useRequireAuth";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash,
  X,
} from "react-feather";
import { Button } from "@/components/ui/button";
import {
  MdProductService,
  ProductResponse,
} from "@/services/masterdata/product.service";
import { useProduct } from "./hooks";
import {
  Insurance,
  InsuranceService,
} from "@/services/masterdata/insurance.service";

const MdProduct = () => {
  useRequireAuth();
  const path = usePathname();
  const mdProdcutService = new MdProductService();
  const insuranceService = new InsuranceService();
  const [insurance, setInsurance] = useState<Insurance[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredProduct, setFilteredProduct] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [tab, setTab] = useState("travel");
  const [totalData, setTotalData] = useState(0);
  const [product, setProduct] = useState<ProductResponse[]>([]);

  const { fetchInsurances } = useProduct();

  useEffect(() => {
    mdProdcutService
      .getProduct(page, rowsPerPage, tab == "Travel" ? "" : tab)
      .then((res) => {
        setCategories(res.data);
        setFilteredProduct(res.data);
        setPage(res.meta.page);
        setTotalPages(res.meta.pageTotal);
        setTotalItems(res.meta.total);
        setTotalData(res.meta.total);
      });
  }, [page, rowsPerPage, tab]);

  useEffect(() => {
    fetchInsurances({});
  }, []);

  useEffect(() => {
    const fetchInsurance = async () => {
      setLoading(true);
      try {
        const result = await insuranceService.getInsurance(page, rowsPerPage);
        setInsurance(result.data);
        setTotalPages(result.meta.pageTotal);
        setTotalItems(result.meta.total);
      } catch (error) {
        console.error("Error fetching insurance products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurance();
  }, [page, rowsPerPage]);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const selectTab = (tab: string) => {
    setTab(tab);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await mdProdcutService.deleteProduct(id);
        setProduct((prevProduct) =>
          prevProduct.filter((product) => product.id !== id)
        );
      } catch (error) {
        console.error("Failed to delete Product:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Declaration":
        return "text-[#016DA1]";
      case "Grace Period":
        return "text-orange-500";
      case "Expired":
        return "text-gray-400";
      default:
        return "text-[#016DA1]";
    }
  };

  const goToDetail = (id: string) => {
    router.push(`${path}/${id}`);
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex gap-2">
        <h1 className="text-black font-bold text-2xl mt-2 mb-4">Product</h1>
        <Button
          onClick={() => router.push(`${path}/add`)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1 " /> Add New
        </Button>
      </div>
      <div className="flex items-center justify-start h-16 bg-white rounded-md mb-3">
        <div
          onClick={() => selectTab("travel")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "travel" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "travel" && "text-primary"
            }`}
          >
            Travel
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "travel" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("personal-accident")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "personal-accident" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "personal-accident" && "text-primary"
            }`}
          >
            Personal Accident
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "personal-accident" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("motor-car")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "motor-car" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "motor-car" && "text-primary"
            }`}
          >
            Mobil
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "motor-car" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("motor-cycle")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "motor-cycle" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "motor-cycle" && "text-primary"
            }`}
          >
            Motor
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "motor-cycle" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("airpaz")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "airpaz" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "airpaz" && "text-primary"
            }`}
          >
            Airpaz
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "airpaz" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
      </div>
      <div className="w-full p-4 md:p-6 bg-white rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap w-12">No.</TableHead>
              <TableHead>Insurance Name</TableHead>
              <TableHead>Total Product</TableHead>
              <TableHead className="whitespace-nowrap w-12">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProduct.map((product, index, insurance) => {
              const rowNumber = (page - 1) * rowsPerPage + index + 1;
              return (
                <TableRow key={product.id}>
                  <TableCell>{rowNumber}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {product?.name || "-"}
                    </div>
                  </TableCell>
                  <TableCell>{product.number}</TableCell>
                  <TableCell>
                    <div className="flex gap-4 items-center">
                      <Button
                        onClick={() => goToDetail(product.id)}
                        className="rounded-full"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 px-0"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
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
                  <span className="mr-2">of {totalItems} items</span>
                  <button
                    onClick={() => setPage((prevState) => prevState - 1)}
                    disabled={page === 1}
                    title="Prev"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() => setPage((prevState) => prevState + 1)}
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
    </div>
  );
};

const MdProductWithSidebar = (params: any) => WithSidebar(MdProduct)(params);
export default MdProductWithSidebar;
