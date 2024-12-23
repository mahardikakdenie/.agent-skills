import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from "../../hooks";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Upload } from "react-feather";

export default function BenefitList(props: { id: string }) {
  const { id } = props;
  const { getPlanBenefits, benefits } = useProducts();
  useEffect(() => {
    (async () => await getPlanBenefits(id))();
  }, []);

  const path = usePathname();
  const router = useRouter();
  return (
    <>
      <Button
        className="mb-5"
        onClick={() => router.push(`${path}/upload-benefit`)}
      >
        <Upload className="w-5 h-5 mr-2" />
        Upload Benefits
      </Button>
      <Table className="table-search-params">
        <TableRow>
          <TableHead>Benefit</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
        <TableBody>
          {benefits.map((benefit: any) => (
            <TableRow key={benefit.id}>
              <TableCell>{benefit.name}</TableCell>
              <TableCell>{benefit.currency}</TableCell>
              <TableCell>{benefit.value || benefit.html}</TableCell>
            </TableRow>
          ))}{" "}
        </TableBody>
      </Table>
    </>
  );
}
