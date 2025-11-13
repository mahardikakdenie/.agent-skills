import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from "../../../hooks";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "react-feather";
import AppURL from "@/constants/app-url.const";

export default function DetailList(props: { id: string }) {
  const { id } = props;
  const { category } = useParams();
  const [type, setType] = useState("tnc");
  const { getPlanDetails, details } = useProducts({
    planId: id,
  });
  useEffect(() => {
    (async () => await getPlanDetails(type))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const path = usePathname();
  const router = useRouter();
  const handleTypeChange = (value: string) => {
    setType(value);
  };
  return (
    <>
      <Button
        className="mb-5"
        onClick={() =>
          router.push(AppURL.productCatalogUploadDetail(category as string, id))
        }
      >
        <Upload className="w-5 h-5 mr-2" />
        Upload Details
      </Button>
      <Select value={type} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 mb-5">
          <SelectValue content="Detail Type" />
          <SelectContent>
            <SelectGroup>
              <SelectItem value="tnc" onClick={() => setType("tnc")}>
                Terms and Conditions
              </SelectItem>
              <SelectItem
                value="how-to-claim"
                onClick={() => setType("how-to-claim")}
              >
                Cara Klaim
              </SelectItem>
              <SelectItem
                value="exception"
                onClick={() => setType("exception")}
              >
                Pengecualian
              </SelectItem>
              <SelectItem
                value="persentase"
                onClick={() => setType("persentase")}
              >
                Persentase
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </SelectTrigger>
      </Select>
      <Table className="table-search-params">
        <TableHeader>
          <TableRow>
            <TableHead>Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((detail: any) => (
            <TableRow key={detail.id}>
              <TableCell>{detail.detail}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
