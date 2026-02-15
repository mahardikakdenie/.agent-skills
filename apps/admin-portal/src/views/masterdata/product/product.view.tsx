import React, { useState, useEffect } from "react";
import {usePathname} from "next/navigation";
import {primary, primaryRed} from "@/constants/app-common.const";
import {productService} from "@/services/product/api/product.service";
import {useScreen} from "@/context/screen.context";
import Button from "@/components/button";
import Select from "@/components/select";
import {useAuth} from "@/context/auth.context";
import {capitalizeStringWithChar, getHeaderPage, getPaddingClass, toastNotification} from "@/helpers/app.helper";
import Input from "@/components/input";
import TrashIcon from "@/images/trash.icon";
import AddIcon from "@/images/add.icon";
import ChecklistIcon from "@/images/checklist.icon";
import EditIcon from "@/images/edit.icon";

export const MasterdataProductView = () => {
    const [categoryList, setCategoryList] = useState<any[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
    const [productRows, setProductRows] = useState<any[]>([]);
    const [tab, setTab] = useState("");
    const [keyNumber, setKeyNumber] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const path = usePathname();
    const { isMobileView, setLoading } = useScreen();
    const { handleResponseError, user } = useAuth();
    const insurerId = user?.account_insurers[0]?.insurance;
    const itemsPerPage = 100;
    const dummyData = { id: Date.now(), name: "" };


    useEffect(() => {
        fetchCategories().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response: any = await productService.getCategories();
            if (response) {
                const list = response?.data || [];
                setCategoryList(list.map((item: any) => ({
                    ...item,
                    label: capitalizeStringWithChar(item.name),
                    color: primary
                })));
                setCategoryOptions(list.map((item: any) => ({
                    label: capitalizeStringWithChar(item.name),
                    value: item.id
                })));
                setTab(list[0].id);
                fetchProducts(currentPage, itemsPerPage, list[0].id).then();
            }
        } catch (error: any) {
            handleResponseError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (page: number, limit: number, tab: string) => {
        try {
            setLoading(true);
            const params = {
                insuranceId: insurerId,
                categoryId: tab,
                pageSize: limit,
                page
            };
            const response: any = await productService.getProducts(params as any);
            if (response) {
                setCurrentPage(page);
                setTotalData(response?.meta?.total || response?.total || 0);

                const rows = response?.data || [];
                if (rows.length === 0) setProductRows([dummyData]);
                else setProductRows(rows);

                plusKey();
            }
        } catch (error: any) {
            handleResponseError(error);
        } finally {
            setLoading(false);
        }
    };

    const createOrUpdateProduct = async (index: number, id: string | number, name: string) => {
        const isCreate = typeof id === "number";
        try {
            setLoading(true);
            const requestBody = {
                category: tab,
                insurance: insurerId,
                name
            }

            const updatedProductRows = [...productRows];

            const response: any = isCreate
                ? await productService.createProduct(requestBody)
                : await productService.updateProduct(id.toString(), requestBody);
            if (response) {
                const newProductId = response?.data?.id || response?.id;
                const newProductName = response?.data?.name || response?.name;

                if (isCreate) {
                    updatedProductRows[index].id = newProductId;
                } else {
                    updatedProductRows[index].name = newProductName;
                    updatedProductRows[index].isEdit = false;
                }
            }

            setProductRows(updatedProductRows);
            toastNotification(`Product ${isCreate ? "added" : "updated"} successfully!`);
            plusKey();
        } catch (error: any) {
            toastNotification(`Failed to ${isCreate ? "add" : "update"} product!`, "error");
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            setLoading(true);
            if (!isNaN(Number(id))) {
                const newProductRows = productRows.filter(row => row.id !== id);
                setProductRows(newProductRows);
                plusKey();
                return;
            }

            const response: any = await productService.deleteProduct(id);
            if (response) {
                toastNotification("Product deleted successfully!");
                const newProductRows = productRows.filter(row => row.id !== id);
                setProductRows(newProductRows);
                plusKey();
            }
        } catch (error: any) {
            toastNotification("Failed to delete product!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (newTab: string) => {
        setTab(newTab);
        setCurrentPage(1);
        fetchProducts(1, itemsPerPage, newTab).then();
    };

    const handleAddNew = () => {
        setProductRows([...productRows, dummyData]);
    };

    const plusKey = () => {
        const newNumber = keyNumber + 1;
        setKeyNumber(newNumber);
    };

    return (
        <div className="mx-auto py-5 px-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
                <p className={`font-bold text-lg ${isMobileView && "mb-2"}`}>{getHeaderPage(2, path, true).pageName}</p>
            </div>
            {isMobileView ? (
                <Select additionalClassNameSelect="pl-4 shadow mb-3 h-[46px]" withBorder={false} value={tab} onChange={(event) => handleTabChange(event.toString())} options={categoryOptions}/>
            ) : (
                <div className="overflow-x-auto sm:scrollable text-center flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
                    {categoryList.map((cs, csIndex) => (
                        <div key={`tab-${cs.id}`} onClick={() => handleTabChange(cs.id)} style={{width: `calc(100% / ${categoryList.length + 1})`}} className={`cursor-pointer h-full flex items-center justify-center ${csIndex === 0 && "pl-5"} ${csIndex !== categoryList.length - 1 && "mr-5"} ${tab === cs.id && "border-b-[3px] border-primary"}`}>
                            <p className={`text-sm mr-3 ${tab === cs.id && "font-semibold text-primary"}`}>{cs.label}</p>
                            <p className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${getPaddingClass(totalData)} ${tab !== cs.id && "hidden"}`}>{totalData > 99 ? 99 : totalData}{totalData > 99 && (<span style={{fontSize: "10px"}}>+</span>)}</p>
                        </div>
                    ))}
                </div>
            )}
            <div className="bg-white rounded-md p-5 shadow">
                <div className="flex items-center justify-end">
                    <Button onClick={handleAddNew} withIcon={true}>
                        {AddIcon("#FFF")}
                        <span className="ml-1 text-white">Add product</span>
                    </Button>
                </div>
                <div className="border rounded-md mt-5">
                    <div className="p-5 bg-primary rounded-t-md flex items-center justify-between">
                        <p className="text-sm text-white font-medium">Product Name</p>
                        <p className="text-sm text-white font-medium">Action</p>
                    </div>
                    <div>
                        {productRows.map((row, index) => (
                            <div key={`product-${keyNumber}-${index}`} className={`flex items-center justify-between ${index % 2 !== 0 && (isNaN(Number(productRows[index].id)) && !row.isEdit) && "bg-gray-100"}`}>
                                {!isNaN(Number(productRows[index].id)) || row.isEdit ? (
                                    <div className="ml-5 my-3 w-full">
                                        <Input value={row.name} onChange={(value) => {
                                            const newRows = [...productRows];
                                            newRows[index].name = value.toString();
                                            setProductRows(newRows);
                                        }} placeholder="Type product name"/>
                                    </div>
                                ) : (
                                    <p className="text-sm p-5 truncate">{row.name}</p>
                                )}
                                <div className="flex items-center ml-3 my-3 mr-5">
                                    {(!isNaN(Number(productRows[index].id)) || row.isEdit) ? (
                                        <div className="clickable" onClick={() => createOrUpdateProduct(index, productRows[index].id, productRows[index].name)}>{ChecklistIcon()}</div>
                                    ) : (
                                        <div className="clickable"
                                             onClick={() => {
                                                 const newRows = [...productRows];
                                                 newRows[index].isEdit = true;
                                                 setProductRows(newRows);
                                             }}>{EditIcon("#000", "16", "16", "0 0 20 20")}</div>
                                    )}
                                    <div onClick={() => deleteProduct(productRows[index].id)} className="ml-3 clickable">{TrashIcon(primaryRed, "16", "16", "0 0 24 24")}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
