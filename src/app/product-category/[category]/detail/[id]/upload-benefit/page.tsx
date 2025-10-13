"use client";
import { useProducts } from "@/app/product-category/hooks";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { useLoading } from "@/context/loading.context";
import { useRouter } from "next/navigation";
import { PRODUCT_CATALOG_DETAIL } from "@/constants/routes";

export default function UploadPlanBenefit({
  params,
}: {
  params: { id: string; category: string };
}) {
  const { plan, fetchPlanById, uploadPlanBenefits } = useProducts();
  const [csvData, setCsvData] = useState<any[]>([]);
  const { isLoading, setLoading } = useLoading();
  useEffect(() => {
    if (params.id) {
      fetchPlanById(params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const [file, setFile] = useState<any>(null);
  const handleChooseFile = (event: any) => {
    setFile(event.target.files[0]);
  };
  const handlePreview = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

  const router = useRouter();
  const handleUpload = async () => {
    setLoading(true);
    try {
      await uploadPlanBenefits(params.id, csvData);
      alert("Package uploaded successfully");
      router.push(PRODUCT_CATALOG_DETAIL(params.category, params.id));
    } catch (error) {
      console.error(error);
      alert("Failed to upload package");
    }
    setLoading(false);
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full h-full overflow-auto">
      <h1>Upload Plan Benefits</h1>
      <h1 className="text-primary font-bold mb-4">
        {plan?.name.split("|").map((item: any, i: any) => {
          return (
            <span key={i}>
              {item}
              <br />
            </span>
          );
        })}
      </h1>
      <Input type="file" onChange={handleChooseFile} />
      <Button
        disabled={!!!file || csvData.length > 0}
        className="btn-primary mt-5"
        onClick={handlePreview}
      >
        Preview
      </Button>
      <Button
        disabled={csvData.length === 0}
        className="btn-primary mt-5 ml-2"
        onClick={handleUpload}
      >
        Upload
      </Button>

      <div className="mt-5 overflow-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {csvData.length > 0 &&
                Object.keys(csvData[0]).map((item, i) => (
                  <TableHead key={i}>{item}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvData.length > 0 &&
              csvData.map((item, i) => (
                <TableRow key={i}>
                  {Object.values(item).map((value: any, j) => (
                    <TableCell key={j}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};