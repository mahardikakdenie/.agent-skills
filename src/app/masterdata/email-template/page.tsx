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
import { ChevronLeft, ChevronRight, Plus, Trash } from "react-feather";
import noData from "/public/images/no-data.webp";
import Image from "next/image";
import {
  CategoriesResponse,
  Insurance,
  InsuranceService,
} from "@/services/masterdata/insurance.service";
import { usePages } from "./hooks";
import { hasPermission } from "@/context/auth.context";
import {
  MailTemplateResponse,
  MailTemplateService,
} from "@/services/masterdata/mail-template.service";
import { capitalizeStringWithChar } from "@/lib/formatter";

const MailTemplate = () => {
  useRequireAuth();
  const path = usePathname();
  const insuranceService = new InsuranceService();
  const categoriesService = new MailTemplateService();
  const mailTemplateService = new MailTemplateService();
  const [insurance, setInsurance] = useState<Insurance[]>([]);
  const [mailTemplate, setMailTemplate] = useState<MailTemplateResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tab, setTab] = useState("");
  const [categories, setCategories] = useState<CategoriesResponse[]>([]);

  const router = useRouter();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Masterdata.Read");
      const editBtn = await hasPermission("Masterdata.Update");
      const deleteBtn = await hasPermission("Masterdata.Delete");
      const createBtn = await hasPermission("Masterdata.Create");

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);
      if (!access) {
        router.push("/forbidden");
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    const fetchMailTemplate = async () => {
      try {
        const result = await mailTemplateService.getMailTemplate(
          page,
          rowsPerPage,
          tab == "Travel" ? "" : tab
        );

        setMailTemplate(result.data);
        setTotalPages(result.meta.pageTotal);
        setTotalItems(result.meta.total);
      } catch (error) {
        console.error("Error fetching insurance products:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchMailTemplate();
  }, [page, rowsPerPage, tab]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoriesService.getCategories();
        setCategories(result);
        if (result.length > 0) {
          setTab(result[0].id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`${path}/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this Email Template?")
    ) {
      try {
        await mailTemplateService.deleteMailTemplate(id);
        setMailTemplate((prev) => prev.filter((mail) => mail.id !== id));
      } catch (error) {
        console.error("Failed to delete Mail Template:", error);
      }
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const selectTab = (tab: string) => {
    setTab(tab);
    setPage(1);
  };

  // if (loading) {
  //   return (
  //     <div className="w-full h-full flex justify-center items-center">
  //       Loading...
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2">
        <h1 className="text-black font-bold text-2xl mt-2 mb-4">
          Mail Template
        </h1>
        <Button
          onClick={() => router.push(`${path}/add`)}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1 " /> Add New
        </Button>
      </div>

      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => selectTab(category.id)}
              className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
                tab === category.id &&
                "border-b-[3px] border-primary sm:px-7 px-5"
              }`}
            >
              <button
                className={`text-sm py-5 ${
                  tab === category.id && "text-primary"
                }`}
              >
                {category.name
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full p-4 bg-white rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap w-12">No.</TableHead>
              <TableHead className="min-w-36">Subject</TableHead>
              <TableHead className="min-w-36">Journey</TableHead>
              <TableHead className="min-w-36">Channel</TableHead>
              <TableHead className="whitespace-nowrap w-12">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mailTemplate.length > 0 ? (
              mailTemplate.map((mail, index) => (
                <TableRow key={mail.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{mail?.subject || "-"}</TableCell>
                  <TableCell>{mail?.journey || "-"}</TableCell>
                  <TableCell>{capitalizeStringWithChar(mail?.type) || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-4 items-center">
                      <Button
                        variant="secondary"
                        disabled={!canEdit}
                        onClick={() => handleEdit(mail.id)}
                        className="bg-[#016DA1] hover:bg-[#016DA1] text-white px-4 rounded-full"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        disabled={!canDelete}
                        onClick={() => handleDelete(mail.id)}
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
                  <span className="mr-2">of {totalItems} items</span>
                  <button
                    onClick={() =>
                      setPage((prevState) => Math.max(prevState - 1, 1))
                    }
                    disabled={page === 1}
                    title="Prev"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() =>
                      setPage((prevState) =>
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
    </div>
  );
};

const MailTemplateWithSidebar = (params: any) =>
  WithSidebar(MailTemplate)(params);
export default MailTemplateWithSidebar;
