"use client";
import { useProducts } from "@/app/product-catalog/hooks";
import { Input } from "@/components/ui/input";
import WithSidebar from "@/hoc/with-sidebar";
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

const UploadPackage = ({
  params,
}: {
  params: { id: string; category: string };
}) => {
  const { plan, fetchPlanById, uploadPackage } = useProducts();
  const [csvData, setCsvData] = useState<any[]>([]);
  const { isLoading, setLoading } = useLoading();
  useEffect(() => {
    if (params.id) {
      fetchPlanById(params.id);
    }
  }, [params.id]);

  const [file, setFile] = useState<any>(null);
  const handleChooseFile = (event: any) => {
    console.log(event);
    setFile(event.target.files[0]);
  };
  const handlePreview = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
          console.log(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

  console.log(isLoading);
  const handleUpload = async () => {
    setLoading(true);
    try {
      await uploadPackage(params.category, params.id, csvData);
      alert("Package uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to upload package");
    }
    setLoading(false);
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1>Upload Package</h1>
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

      <div className="mt-5">
        <Table>
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

const WithSidebarUploadPackage = (params: any) =>
  WithSidebar(UploadPackage)(params);

export default WithSidebarUploadPackage;
