import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { claimsService } from "@/services/claims/api/claims.service";
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

  const { mutate: mutateDetailClaim, isPending: isLoading } = useMutation({
    mutationFn: (id: string) => claimsService.getClaimById(id),
    onSuccess: (res) => {
      if (res) {
        setDetailClaim(res);
      }
    },
    onError: (error) => {
      console.error("Failed to fetch claim details:", error);
    },
  });

  const { mutate: mutateFormClaims, isPending: isLoadingFormClaims } =
    useMutation({
      mutationFn: ({
        categoryId,
        params,
      }: {
        categoryId: string;
        params?: ClaimFormsRequest;
      }) => claimsService.getClaimCategoryForms(categoryId, params),
      onSuccess: (res) => {
        const response = (res as any)?.data;
        if (response) {
          const claimForms: any = [
            ...response.filter((item: any) => item.name != "chronology"),
            ...detailClaim!.claim_config.map((item: any) => ({
              ...item,
              form: "claim_config",
            })),
          ];

          setFlatClaimForm(claimForms);
          const flattenClaimForms = flattenClaimFormFields(claimForms);
          const missingDocs = Object.keys(flattenClaimForms)
            .filter(
              (fieldName) =>
                detailClaim?.lack_of_documents?.indexOf(fieldName) > -1
            )
            .map((fieldName) => flattenClaimForms[fieldName]);

          setClaimForms(missingDocs);

          const updatedFormValue = { ...formValue };

          missingDocs.forEach((item: any) => {
            let initialValue =
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

          setFormValue(updatedFormValue);

          const parentForms = filterSchemaByNames(claimForms, missingDocs);
          setAllClaimForms(parentForms);
        }
      },
      onError: (error) => {
        console.error("Failed to fetch form claims:", error);
      },
    });

  const {
    mutateAsync: muateAsyncUpdateClaimsGrab,
    isPending: isUpdatingClaimsGrab,
  } = useMutation({
    mutationFn: ({
      id,
      params,
    }: {
      id: string;
      params: UpdateClaimGrabRequest;
    }) => claimsService.updateClaim(id, params),
    onError: (error) => {
      toast.error("Failed to update claims");
      console.error("Failed to update claims grab:", error);
    },
  });

  const {
    mutate: mutateSubmitClaimsById,
    isPending: isLoadingSubmitClaimsById,
  } = useMutation({
    mutationFn: ({ id }: { id: string }) => claimsService.submitClaim(id),
    onSuccess: () => {
      toast.success("Uploaded Successfull!");
      if (detailClaim?.id) {
        mutateDetailClaim(detailClaim.id);
        router.back();
      }
    },
    onError: (error) => {
      toast.error("Failed to submit claims");
      console.error("Failed to submit claims by id:", error);
    },
  });

  useEffect(() => {
    if (detailClaim && claims) {
      const channelId = claims.channel || claims.account_channels?.[0]?.channel;
      getFormClaim(detailClaim.category, { channel: channelId });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailClaim, claims]);

  const getFormClaim = (categoryId: string, params?: ClaimFormsRequest) => {
    mutateFormClaims({ categoryId, params });
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
        const response = await muateAsyncUpdateClaimsGrab({
          id: detailClaim.id,
          params,
        });
        if (response) {
          mutateSubmitClaimsById({
            id: detailClaim.id,
          });
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
    getDetailClaim: mutateDetailClaim,
    getFormClaim,
    handleChangeFileClaim,
    handleChangeMultipleFileClaim,
  };
}
