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
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash, Upload } from "react-feather";
import AppURL from "@/constants/app-url.const";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BenefitList(props: { id: string }) {
  const { id } = props;
  const { category } = useParams();
  const { getPlanBenefits, benefits, deleteBenefit } = useProducts();

  useEffect(() => {
    (async () => await getPlanBenefits(id))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();

  return (
    <>
      <div className="flex justify-end gap-x-4">
        <Button
          className="mb-5"
          onClick={() =>
            router.push(AppURL.productCatalogUploadBenefit(category as string, id))
          }
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Benefits
        </Button>
        <Button
          className="bg-[#F5BA41] hover:bg-[#F5BA41]/80 text-black"
          onClick={() =>
            router.push(AppURL.productCatalogAddBenefit(category as string, id))
          }
        >
          <Plus className="w-5 h-5 mr-2" /> Add Benefit
        </Button>
      </div>
      <Table className="table-search-params">
        <TableHeader>
          <TableRow>
            <TableHead>Benefit</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {benefits.map((benefit: any) => (
            <TableRow key={benefit.id}>
              <TableCell>{benefit.name}</TableCell>
              <TableCell>{benefit.currency}</TableCell>
              <TableCell>{benefit.value || benefit.html}</TableCell>
              <TableCell>
                {benefit.level === 0 && (
                  <div className="flex gap-x-2">
                    {/* <Button
                    type="button"
                    variant="default"
                    className="rounded-full"
                    onClick={() =>
                      router.push(
                        AppURL.productCatalogEditPackage(category, id, pkg.id)
                      )
                    }
                  >
                    Edit
                  </Button> */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={async () => {
                              if (confirm("Are you sure to delete this row?")) {
                                try {
                                  await deleteBenefit(benefit.id);

                                  alert("Row deleted successfully.");

                                  await getPlanBenefits(id);
                                } catch (error) {
                                  console.error(error);

                                  alert("Error while deleting the row.");
                                }
                              }
                            }}
                          >
                            <Trash className="w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">Remove</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
