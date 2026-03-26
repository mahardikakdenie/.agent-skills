"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { useProduct } from "@/app/masterdata/product/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { productService } from "@/services/product/api/product.service";
import Image from "next/image";
import noData from "@public/images/no-data.webp";
import { Eye, ChevronLeft, ChevronRight } from "react-feather";
import { useScreen } from "@/context/screen.context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AssignPlan = ({
  id,
  channelName,
}: {
  id: string;
  channelName: string;
}) => {
  const { fetchCategories, categories } = useProduct();
  const [activeTab, setActiveTab] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const { setLoading } = useScreen();

  const [assignedPlans, setAssignedPlans] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    planId: string;
    type: "assign" | "unassign";
  } | null>(null);

  // Separate useEffect for initial category fetch
  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories("");
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // New useEffect to set default tab when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  // Separate useEffect for fetching plans when activeTab changes
  useEffect(() => {
    if (activeTab) {
      const category = categories.find((cat) => cat.id === activeTab);
      if (category) {
        fetchPlans(category.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, rowsPerPage]);

  useEffect(() => {
    if (!id) return;
    const loadAssignedPlans = async () => {
      const response: any = await productService.getChannelPackagesByChannel(id);
      if (response) {
        setAssignedPlans(response?.data || response || []);
      }
    };
    loadAssignedPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPlans = async (category: string) => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize: rowsPerPage,
        category,
      };
      const response: any = await productService.getPlans(params);
      if (response?.data && response?.meta) {
        setProducts(response.data);
        setPage(response.meta.page);
        setTotalPages(Math.ceil(response.meta.total / rowsPerPage));
        setTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = async (categoryId: string) => {
    setActiveTab(categoryId);
    setPage(1);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const isPlanAssigned = (planId: string) => {
    return assignedPlans.some((ap) => ap.plan === planId);
  };

  const getChannelPlanId = (planId: string) => {
    const assignedPlan = assignedPlans.find((ap) => ap.plan === planId);
    return assignedPlan?.plan;
  };

  const handleActionConfirm = async () => {
    if (!selectedAction) return;

    try {
      if (selectedAction.type === "assign") {
        await productService.assignChannelPlans({
          channel: id,
          plans: [selectedAction.planId],
          channelName,
        });
      } else {
        await productService.unassignChannelPlans({
          channel: id,
          plans: [selectedAction.planId],
        });
      }

      // Refresh assigned plans
      const response: any = await productService.getChannelPackagesByChannel(id);
      if (response) {
        setAssignedPlans(response?.data || response || []);
      }

      // Refresh current tab
      if (activeTab) {
        const category = categories.find((cat) => cat.id === activeTab);
        if (category) {
          fetchPlans(category.name);
        }
      }
    } catch (error) {
      console.error("Failed to process plan:", error);
    } finally {
      setDialogOpen(false);
      setSelectedAction(null);
    }
  };

  const openConfirmDialog = (planId: string, type: "assign" | "unassign") => {
    setSelectedAction({ planId, type });
    setDialogOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <Tabs
          value={activeTab}
          defaultValue={categories[0]?.id}
          className="w-full"
        >
          <div className="relative"></div>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <TabsList className="inline-flex min-w-full border-b pb-0">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  onClick={() => handleTabChange(category.id)}
                  className="min-w-[150px] whitespace-nowrap"
                >
                  {formatCategoryName(category.name)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="p-4">
                <Table className="table-product-catalog">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">
                        Insurer
                      </TableHead>
                      <TableHead className="min-w-44">Plan Name</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Product
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length > 0 ? (
                      products.map((product, index) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex gap-2 items-center">
                              <div className="inline-flex justify-center items-center w-8 min-w-8 h-8">
                                <Image
                                  src={product.products.insurances.logo_url}
                                  alt=""
                                  width={100}
                                  height={50}
                                  className="w-full h-auto"
                                />
                              </div>
                              {product.products.insurances.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {product.name
                              .split("|")
                              .map((item: string, i: number) => (
                                <div key={i}>{item}</div>
                              ))}
                          </TableCell>
                          <TableCell>{product.products.name}</TableCell>
                          <TableCell>
                            {isPlanAssigned(product.id) ? (
                              <Button
                                variant="secondary"
                                onClick={() =>
                                  openConfirmDialog(product.id, "unassign")
                                }
                                className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-full"
                              >
                                Unassign
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                onClick={() =>
                                  openConfirmDialog(product.id, "assign")
                                }
                                className="bg-[#016DA1] hover:bg-[#016DA1] text-white px-4 rounded-full"
                              >
                                Assign
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="hover:!bg-white">
                        <TableCell colSpan={5}>
                          <div className="flex flex-col gap-4 items-center justify-center py-14">
                            <Image alt="no data" src={noData} width={200} />
                            No plans available
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="flex justify-center items-center gap-2 font-normal">
                          <label htmlFor="rowsPerPage">Showing:</label>
                          <select
                            id="rowsPerPage"
                            className="p-2 border rounded"
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                          >
                            {[10, 20, 30, 50].map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <span className="mr-2">of {totalItems} items</span>
                          <button
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                            className="disabled:opacity-50"
                          >
                            <ChevronLeft />
                          </button>
                          <button
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                            className="disabled:opacity-50"
                          >
                            <ChevronRight />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAction?.type === "assign"
                ? "Assign Plan"
                : "Unassign Plan"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedAction?.type} this plan?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setSelectedAction(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleActionConfirm}
              className={
                selectedAction?.type === "assign"
                  ? "bg-[#016DA1] hover:bg-[#016DA1] text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {selectedAction?.type === "assign" ? "Assign" : "Unassign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignPlan;
