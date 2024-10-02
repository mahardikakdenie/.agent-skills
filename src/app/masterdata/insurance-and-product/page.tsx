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
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "react-feather";

import noData from "/public/images/no-data.webp";
import Image from "next/image";
import {
  ProductInsurance,
  ProductInsuranceProductService,
} from "@/services/masterdata/insurance-product.service";

const InsuranceProduct = () => {
  useRequireAuth();
  const path = usePathname();
  const insuranceProductService = new ProductInsuranceProductService();
  const [insurance, setInsurance] = useState<ProductInsurance[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchInsuranceProduct = async () => {
      try {
        const result = await insuranceProductService.getInsuranceProduct();
        setInsurance(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsuranceProduct();
  }, []);
  if (!insurance) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  const handleEdit = (id: string) => {
    router.push(`${path}/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await insuranceProductService.deleteInsuranceProduct(id);
        setInsurance((prevInsurance) =>
          prevInsurance.filter((insurance) => insurance.id !== id)
        );
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete insurance:", error);
      }
    }
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2">
        <h1 className="text-black font-bold text-2xl mt-2 mb-4">
          Product Category
        </h1>
        <Button
          onClick={() => router.push(`${path}/add`)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1 " /> Add New
        </Button>
      </div>

      <div className="w-full p-4 bg-white rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap w-12">No.</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Logo File</TableHead>
              <TableHead className="whitespace-nowrap w-36">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {insurance.length > 0 ? (
              insurance.map((insurance, index) => (
                <TableRow key={insurance.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{insurance.name}</TableCell>
                  <TableCell>{insurance.logo_url}</TableCell>
                  <TableCell>
                    <div className="flex gap-4 items-center">
                      <Button
                        variant="secondary"
                        // onClick={() => handleEdit(insurance.id)}
                        className="bg-[#016DA1] hover:bg-[#016DA1] text-white px-4 rounded-full"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(insurance.id)}
                        className="text-red-600 px-0"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:!bg-white">
                <TableCell colSpan={5}>
                  <div className="flex flex-col gap-4 items-center justify-center py-14">
                    <Image alt="no data" src={noData} width={200} /> No
                    transaction data available
                  </div>
                </TableCell>{" "}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const InsuranceProductWithSidebar = (params: any) =>
  WithSidebar(InsuranceProduct)(params);
export default InsuranceProductWithSidebar;
