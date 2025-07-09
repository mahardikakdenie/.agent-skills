import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from "../../hooks";
import { useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Upload } from "react-feather";
import { PRODUCT_CATALOG_UPLOAD_BENEFIT } from "@/constants/routes";

export default function BenefitList(props: { id: string }) {
  const { id } = props;
  const { category } = useParams();
  const { getPlanBenefits, benefits } = useProducts();
  useEffect(() => {
    (async () => await getPlanBenefits(id))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const path = usePathname();
  const router = useRouter();
  return (
    <>
      <Button
        className="mb-5"
        onClick={() =>
          router.push(PRODUCT_CATALOG_UPLOAD_BENEFIT(category as string, id))
        }
      >
        <Upload className="w-5 h-5 mr-2" />
        Upload Benefits
      </Button>
      <Table className="table-search-params">
        <TableHeader>
          <TableRow>
            <TableHead>Benefit</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {benefits.map((benefit: any) => (
            <TableRow key={benefit.id}>
              <TableCell>{benefit.name}</TableCell>
              <TableCell>{benefit.currency}</TableCell>
              <TableCell>{benefit.value || benefit.html}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
