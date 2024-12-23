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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const UploadPlanDetail = ({
  params,
}: {
  params: { id: string; category: string };
}) => {
  const { plan, fetchPlanById, uploadPlanDetails } = useProducts();
  const [csvData, setCsvData] = useState<any[]>([]);
  const { isLoading, setLoading } = useLoading();
  const [type, setType] = useState<string>("tnc");
  useEffect(() => {
    if (params.id) {
      fetchPlanById(params.id);
    }
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
      await uploadPlanDetails(params.id, type, csvData);
      alert("Package uploaded successfully");
      router.push(`/product-catalog/${params.category}/${params.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to upload package");
    }
    setLoading(false);
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full h-full overflow-auto">
      <h1>Upload Plan Details</h1>
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
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 mb-5">
          <SelectValue content="Detail Type" />
          <SelectContent>
            <SelectGroup>
              <SelectItem value="tnc">Terms and Conditions</SelectItem>
              <SelectItem value="how-to-claim">Cara Klaim</SelectItem>
              <SelectItem value="exception">Pengecualian</SelectItem>
              <SelectItem value="persentase">Persentase</SelectItem>
            </SelectGroup>
          </SelectContent>
        </SelectTrigger>
      </Select>
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

const WithSidebarUploadPackage = (params: any) =>
  WithSidebar(UploadPlanDetail)(params);

export default WithSidebarUploadPackage;
