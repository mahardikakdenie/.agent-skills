import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useSubmitClaim } from "@/services/claims/hooks/mutations/useSubmitClaim";
import { useUpdateClaim } from "@/services/claims/hooks/mutations/useUpdateClaim";
import { useClaimCategoryForms } from "@/services/claims/hooks/queries/useClaimCategoryForms";
import { useClaimDetail } from "@/services/claims/hooks/queries/useClaimDetail";
import {
  ClaimForm,
  ClaimFormsRequest,
  UpdateClaimGrabRequest,
} from "@/interface";
import { useAuth } from "@/context/auth.context";
import {
  applyFieldUpdates,
  filterSchemaByNames,
  flattenClaimFormFields,
} from "@/lib/utils";

type useDetailClaimProps = {
  isLoading: boolean;
  detailClaim: any;
  claimForms: ClaimForm[];
  formValue: any;
  getDetailClaim: (id: string) => void;
  getFormClaim: (categoryId: string, params?: ClaimFormsRequest) => void;
  handleChangeFileClaim: (
    fieldName: string,
    fileName: string,
    base64: string
  ) => void;
  handleChangeMultipleFileClaim: (
    index: number,
    fieldName: string,
    fileName: string,
    base64: string
  ) => void;
  handleSubmitMissingDocument: () => void;
  getMissingDocuments: (lackOfDocuments: string[]) => any[];
};

export function useDetailClaim(): useDetailClaimProps {
  const router = useRouter();
  const { user: claims } = useAuth();

  const [detailClaim, setDetailClaim] = useState<any>(null);

  const [allClaimForms, setAllClaimForms] = useState<ClaimForm[]>([]);
  const [claimForms, setClaimForms] = useState<ClaimForm[]>([]);
  const [flatClaimForm, setFlatClaimForm] = useState<any[]>([]);

  const [formValue, setFormValue] = useState<any>({});
  const [claimId, setClaimId] = useState("");
  const [claimFormRequest, setClaimFormRequest] = useState<{
    categoryId: string;
    params?: ClaimFormsRequest;
  } | null>(null);

  const {
    data: detailClaimResponse,
    isLoading: isLoading,
    refetch: refetchDetailClaim,
  } = useClaimDetail(claimId, {
    enabled: !!claimId,
    retry: 0,
  });

  const {
    data: formClaimsResponse,
    isLoading: isLoadingFormClaims,
  } = useClaimCategoryForms(
    claimFormRequest?.categoryId || "",
    claimFormRequest?.params,
    {
      enabled: !!claimFormRequest?.categoryId,
      retry: 0,
    }
  );

  const {
    mutateAsync: mutateAsyncUpdateClaimsGrab,
    isPending: isUpdatingClaimsGrab,
  } = useUpdateClaim({
    onError: (error) => {
      toast.error("Failed to update claims");
      console.error("Failed to update claims grab:", error);
    },
  });

  const {
    mutate: mutateSubmitClaimsById,
    isPending: isLoadingSubmitClaimsById,
  } = useSubmitClaim({
    onSuccess: () => {
      toast.success("Uploaded Successfull!");
      if (detailClaim?.id) {
        void refetchDetailClaim();
        router.back();
      }
    },
    onError: (error) => {
      toast.error("Failed to submit claims");
      console.error("Failed to submit claims by id:", error);
    },
  });

  useEffect(() => {
    if (detailClaimResponse) {
      setDetailClaim(detailClaimResponse);
    }
  }, [detailClaimResponse]);

  useEffect(() => {
    const response = (formClaimsResponse as any)?.data || formClaimsResponse;
    if (!response || !Array.isArray(response) || !detailClaim) return;

    const claimForms: any = [
      ...response.filter((item: any) => item.name != "chronology"),
      ...(detailClaim.claim_config || []).map((item: any) => ({
        ...item,
        form: "claim_config",
      })),
    ];

    setFlatClaimForm(claimForms);
    const flattenClaimForms = flattenClaimFormFields(claimForms);
    const missingDocs = Object.keys(flattenClaimForms)
      .filter((fieldName) => (detailClaim?.lack_of_documents || []).indexOf(fieldName) > -1)
      .map((fieldName) => flattenClaimForms[fieldName]);

    setClaimForms(missingDocs);

    setFormValue((prev: any) => {
      const updatedFormValue = { ...prev };

      missingDocs.forEach((item: any) => {
        if (updatedFormValue[item.name]) return;
        
        const initialValue =
          item.type.toLowerCase() == "file"
            ? {
                ext: "",
                fileName: "",
                data: "",
              }
            : item.type.toLowerCase() == "file multiple"
            ? [
                {
                  ext: "",
                  fileName: "",
                  data: "",
                },
              ]
            : "";
        updatedFormValue[item.name] = initialValue;
      });

      return updatedFormValue;
    });

    const parentForms = filterSchemaByNames(claimForms, missingDocs);
    setAllClaimForms(parentForms);
  }, [detailClaim, formClaimsResponse]);

  useEffect(() => {
    if (detailClaim && claims) {
      const channelId = claims.channel || claims.account_channels?.[0]?.channel;
      getFormClaim(detailClaim.category, { channel: channelId });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailClaim, claims]);

  const getDetailClaim = (id: string) => {
    setClaimId(id);
  };

  const getFormClaim = (categoryId: string, params?: ClaimFormsRequest) => {
    setClaimFormRequest({ categoryId, params });
  };

  const handleChangeFileClaim = (
    fieldName: string,
    fileName: string,
    base64: string
  ) => {
    const ext = fileName.split(".").pop();

    const fieldValue = {
      ext: ext,
      fileName: fileName,
      data: base64,
    };
    let updatedFormValues = {
      ...formValue,
      [fieldName]: fieldValue,
    };
    setFormValue(updatedFormValues);
  };

  const handleChangeMultipleFileClaim = (
    index: number,
    fieldName: string,
    fileName: string,
    base64: string
  ) => {
    const ext = fileName.split(".").pop();
    let updatedValue = formValue[fieldName];
    const data = {
      ext: ext,
      fileName: fileName,
      data: base64,
    };
    if (typeof updatedValue[index] != undefined) {
      updatedValue[index] = data;
    }

    let updatedFormValues = {
      ...formValue,
      [fieldName]: updatedValue,
    };

    setFormValue(updatedFormValues);
  };

  const handleSubmitMissingDocument = async () => {
    try {
      if (detailClaim) {
        const patched: any = applyFieldUpdates(allClaimForms, formValue);
        const params: UpdateClaimGrabRequest = {
          form: patched,
        };
        const response = await mutateAsyncUpdateClaimsGrab({
          id: detailClaim.id,
          payload: params,
        });
        if (response) {
          mutateSubmitClaimsById(detailClaim.id);
        }
      }
    } catch (err) {
      console.error("Error during claim submission:", err);
    }
  };

  const getMissingDocuments = (lackOfDocuments: string[]) => {
    if (flatClaimForm.length === 0) return [];

    const flattenClaimForms = flattenClaimFormFields(flatClaimForm);
    return Object.keys(flattenClaimForms)
      .filter((fieldName) => lackOfDocuments.indexOf(fieldName) > -1)
      .map((fieldName) => flattenClaimForms[fieldName]);
  };

  return {
    isLoading:
      isLoading ||
      isLoadingFormClaims ||
      isUpdatingClaimsGrab ||
      isLoadingSubmitClaimsById,
    claimForms,
    detailClaim,
    formValue,
    getMissingDocuments,
    handleSubmitMissingDocument,
    getDetailClaim,
    getFormClaim,
    handleChangeFileClaim,
    handleChangeMultipleFileClaim,
  };
}
