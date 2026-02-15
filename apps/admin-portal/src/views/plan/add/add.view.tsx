import React, {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {ChevronLeft} from "react-feather";
import {productService} from "@/services/product/api/product.service";
import {getBreadcrumbs, getHeaderPage, toastNotification} from "@/helpers/app.helper";
import {useScreen} from "@/context/screen.context";
import Select from "@/components/select";
import {useAuth} from "@/context/auth.context";
import {primary} from "@/constants/app-common.const";
import Input from "@/components/input";
import Button from "@/components/button";

export const AddPlanView = () => {
    const [selectedProduct, setSelectedProduct] = useState("");
    const [planName, setPlanName] = useState("");
    const [planSlug, setPlanSlug] = useState("");
    const [productList, setProductList] = useState<any[]>([]);
    const path = usePathname();
    const router = useRouter();
    const { setLoading } = useScreen();
    const { handleResponseError, user } = useAuth();
    const { pageName, breadcrumbsArray } = getHeaderPage(3, path, false);
    const insurerId = user?.account_insurers[0]?.insurance;

    useEffect(() => {
        const fetchProductsAdd = async () => {
            try {
                setLoading(true);
                const responseAdd: any = await productService.getProducts({ insuranceId: insurerId });
                if (responseAdd) {
                    const list = responseAdd?.data || [];
                    setProductList(list.map((item: any) => ({
                        label: item.name || "-",
                        value: item.id
                    })));
                }
            } catch (error: any) {
                handleResponseError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchProductsAdd().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createPlan = async () => {
        try {
            setLoading(true);
            const requestBody = {
                insuranceId: insurerId,
                productId: selectedProduct,
                name: planName,
                slug: planSlug
            }
            const response: any = await productService.createPlan(requestBody);
            if (response) {
                toastNotification("Plan created successfully!");
                goToPlanListPage();
            }
        } catch (error: any) {
            toastNotification("Failed to create plan!", "error");
        } finally {
            setLoading(false);
        }
    };

    const goToPlanListPage = () => {
        router.push(path.split("/").slice(0, -2).join("/"))
    };

    return (
        <div className="mx-auto">
            <div className="bg-white flex items-center justify-between mb-5 py-5 px-7">
                <div>
                    {getBreadcrumbs(breadcrumbsArray)}
                    <p className="font-bold text-lg">{pageName}</p>
                </div>
                <div onClick={goToPlanListPage} className="flex items-center justify-between cursor-pointer">
                    <ChevronLeft color="red" width="30" height="15"/>
                    <p className="text-sm text-red-500">Back</p>
                </div>
            </div>
            <div className="pb-5 px-7">
                <div className="p-5 bg-white rounded-md shadow">
                    <div className="mb-3">
                        <p className="mb-2 text-sm font-medium">Product</p>
                        <Select chevronColor={primary} placeholderSelectClassName="truncate" additionalClassNameSelect="pl-4 h-[46px]" value={selectedProduct} onChange={(value) => setSelectedProduct(value.toString())} options={productList}/>
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 text-sm font-medium">Plan Name</p>
                        <Input value={planName} onChange={(value) => setPlanName(value.toString())} onClear={() => setPlanName("")} placeholder="Type plan name"/>
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 text-sm font-medium">Slug</p>
                        <Input value={planSlug} onChange={(value) => setPlanSlug(value.toString())} onClear={() => setPlanSlug("")} placeholder="Type slug"/>
                    </div>
                    <div>
                        <Button disabled={!selectedProduct || !planName || !planSlug} onClick={createPlan}>Save</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
