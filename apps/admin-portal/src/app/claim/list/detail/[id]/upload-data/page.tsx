"use client";

import React, { useEffect } from "react";
import { Form, Field } from "react-final-form";
import { useParams } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { Button } from "@repo/ui";
import UploadFile from "@/components/ui/FileUpload";
import { ContentLoadingWrapper } from "@/components/ui/loading";
import { useDetailClaim } from "@/hooks/useDetailClaim.hooks";
import { ClaimFieldInputType } from "@/interface";
import AppURL from "@/constants/app-url.const";

function UploadData() {
  const params = useParams();
  const {
    getDetailClaim,
    isLoading,
    claimForms,
    formValue,
    handleChangeFileClaim,
    handleChangeMultipleFileClaim,
    handleSubmitMissingDocument,
  } = useDetailClaim();

  useEffect(() => {
    if (params.id) {
      getDetailClaim(params.id as string);
    }
  }, [params.id, getDetailClaim]);

  const breadcrumbs = [
    { label: "Claim" },
    { label: "List", href: AppURL.claimList },
    { label: "Detail", href: `${AppURL.claimDetail}/${params.id}` },
    { label: "Upload Data", isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      <div className="flex flex-col w-full">
        <PageHeader
          title="Upload Document"
          breadcrumbs={breadcrumbs}
          showBackButton={true}
        />

        <Form
          onSubmit={() => handleSubmitMissingDocument()}
          initialValues={formValue}
          validate={(values) => {
            const errors = {} as any;
            claimForms.forEach((claim) => {
              const label =
                claim.label.en ||
                claim?.label_multilanguage?.en ||
                claim.label ||
                "";
              if (claim.required && !formValue[claim.name]?.data) {
                errors[claim.name] = `${label} cannot be empty!`;
              }
            });
            return errors;
          }}
        >
          {({ handleSubmit, valid }) => (
            <div className="flex flex-col w-full p-4 md:p-6 rounded-xl">
              <div className="bg-white p-6 rounded-xl gap-4 flex flex-col">
                <div className="flex flex-col gap-6 max-w-[672px]">
                  <p className="font-semibold text-base">
                    Please upload documents on behalf of customers in PNG, JPEG,
                    or PDF format.
                  </p>

                  {claimForms.map((item, index) => (
                    <Field name={item.name} key={index}>
                      {({ meta }) => (
                        <UploadFile
                          label={
                            item.label.en ||
                            item?.label_multilanguage?.en ||
                            item.label ||
                            ""
                          }
                          value={
                            item.type.toLowerCase() ==
                              ClaimFieldInputType.File && formValue[item.name]
                              ? formValue[item.name].fileName
                              : item.type.toLowerCase() ==
                                ClaimFieldInputType.FileMultiple
                              ? formValue[item.name].map(
                                  (value: any) => value.fileName
                                )
                              : formValue[item.name]
                          }
                          accept=".png,.jpg,.jpeg,.pdf"
                          placeholder="Upload document"
                          onFileChange={(val) => {
                            if (
                              item.type.toLowerCase() ==
                              ClaimFieldInputType.File
                            ) {
                              handleChangeFileClaim(
                                item.name,
                                val.fileName || "",
                                val.base64 || ""
                              );
                            } else if (
                              item.type.toLowerCase() ==
                              ClaimFieldInputType.FileMultiple
                            ) {
                              handleChangeMultipleFileClaim(
                                index,
                                item.name,
                                val.fileName || "",
                                val.base64 || ""
                              );
                            }
                          }}
                          error={meta.error && meta.touched && meta.error}
                        />
                      )}
                    </Field>
                  ))}

                  <p className="text-sm">
                    Once data has been uploaded, you can't edit it unless you
                    change the status to Lack of Documents
                  </p>
                </div>

                <Button
                  size="sm"
                  className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full w-fit"
                  onClick={handleSubmit}
                  disabled={!valid}
                >
                  Save Documents
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </ContentLoadingWrapper>
  );
}

export default UploadData;
