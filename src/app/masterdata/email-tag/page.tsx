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
import { hasPermission } from "@/context/auth.context";
import { EmailTagService } from "@/services/masterdata/email-tag.service";
import { EmailTagResponse } from "@/services/masterdata/mail-template.service";

const EmailTag = () => {
  useRequireAuth();
  const path = usePathname();
  const emailTagService = new EmailTagService();
  const [emailTag, setEmailTag] = useState<EmailTagResponse[]>([]);
  const [loading, setLoading] = useState(true);

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
    const fetchEmailTag = async (search: any) => {
      try {
        const result = await emailTagService.getEmailTag(search);
        setEmailTag(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmailTag({});
  }, []);

  if (!emailTag) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  const handleEdit = (id: string) => {
    router.push(`${path}/${id}`);
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this Email Tag?")) {
      try {
        await emailTagService.deleteEmailTag(id);
        setEmailTag((prev) => prev.filter((emailTag) => emailTag.id !== id));
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete Email Tag:", error);
      }
    }
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2 sm:flex-row flex-col pb-4">
        <h1 className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          Email Tag
        </h1>
        <Button
          onClick={() => router.push(`${path}/add`)}
          disabled={!canCreate}
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
              <TableHead className="min-w-36">Tag Name</TableHead>
              <TableHead className="min-w-36">Journey</TableHead>
              <TableHead className="whitespace-nowrap w-36">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emailTag.length > 0 ? (
              emailTag.map((tag, index) => (
                <TableRow key={tag.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{tag.tag || "-"}</TableCell>
                  <TableCell>{tag.journey || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-4 items-center">
                      <Button
                        variant="secondary"
                        disabled={!canEdit}
                        onClick={() => handleEdit(tag.id)}
                        className="bg-[#016DA1] hover:bg-[#016DA1] text-white px-4 rounded-full"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        disabled={!canDelete}
                        onClick={() => handleDeletePlan(tag.id)}
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

const EmailTagWithSidebar = (params: any) => WithSidebar(EmailTag)(params);
export default EmailTagWithSidebar;
