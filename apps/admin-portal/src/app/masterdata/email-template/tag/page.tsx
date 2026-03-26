"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Trash } from "react-feather";
import { usePages } from "../hooks";
import { useEffect } from "react";
import AppURL from "@/constants/app-url.const";

export default function EmailTagPage() {
  const { fetchEmailTag, emailTag } = usePages();

  useEffect(() => {
    fetchEmailTag({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const router = useRouter();

  function handleDelete(id: any): void {
    throw new Error("Function not implemented.");
  }

  const path = usePathname();

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2">
        <h1 className="text-black font-bold text-2xl mt-2 mb-4">Email Tags</h1>
        <Button
          onClick={() => router.push(AppURL.masterdataEmailTemplateTagAdd)}
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
              <TableHead className="min-w-36">Journey</TableHead>
              <TableHead className="min-w-36">Tag</TableHead>
              <TableHead className="whitespace-nowrap w-12">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emailTag?.map((item: any, index: any) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.journey}</TableCell>
                <TableCell>{item.tag}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    className="btn btn-primary"
                    onClick={() =>
                      router.push(`${AppURL.masterdataEmailTemplateTagDetail}/${item.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 px-0"
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
