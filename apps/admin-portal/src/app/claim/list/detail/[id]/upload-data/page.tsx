'use client';

import { CheckCircle2, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { Form, Field } from 'react-final-form';

import { Button, Box, FileUpload } from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';
import { useDetailClaim } from '@/hooks/useDetailClaim.hooks';
import { ClaimFieldInputType } from '@/interface';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

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
    { label: 'Claim' },
    { label: 'List', href: AppURL.claimList },
    { label: 'Detail', href: `${AppURL.claimDetail}/${params.id}` },
    { label: 'Upload Data', isCurrentPage: true },
  ];

  const renderEmptyState = () => (
    <Box className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-border/40 text-center gap-6">
      <Box className="h-20 w-20 rounded-full bg-[#00AB4F]/10 flex items-center justify-center text-[#00AB4F]">
        <CheckCircle2 size={40} />
      </Box>
      <Box className="flex flex-col gap-2 max-w-md">
        <Box as="h3" className="text-xl font-bold text-foreground">
          All Documents Uploaded
        </Box>
        <Box as="p" className="text-muted-foreground">
          There are no missing documents required for this claim. You can go back to the claim
          details page.
        </Box>
      </Box>
      <Button asChild variant="outline" className="rounded-full px-8">
        <Link href={`${AppURL.claimDetail}/${params.id}`}>Back to Detail</Link>
      </Button>
    </Box>
  );

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      <Box className="flex flex-col w-full">
        <PageHeader title="Upload Document" breadcrumbs={breadcrumbs} showBackButton={true} />

        <Box className="flex flex-col w-full p-4 md:p-6">
          {!isLoading && claimForms.length === 0 ? (
            renderEmptyState()
          ) : (
            <Form
              onSubmit={() => handleSubmitMissingDocument()}
              initialValues={formValue}
              validate={() => {
                const errors = {} as any;
                claimForms.forEach((claim) => {
                  const label =
                    claim.label.en || claim?.label_multilanguage?.en || claim.label || '';
                  if (claim.required && !formValue[claim.name]?.data) {
                    errors[claim.name] = `${label} cannot be empty!`;
                  }
                });
                return errors;
              }}
            >
              {({ handleSubmit, submitting, valid }) => (
                <Box className="bg-white p-6 rounded-xl gap-4 flex flex-col shadow-sm border border-border/40">
                  <Box className="flex flex-col gap-6 max-w-[672px]">
                    <Box className="flex items-center gap-3 text-foreground font-semibold text-lg">
                      <FileCheck className="text-primary h-6 w-6" />
                      Please upload missing documents
                    </Box>
                    <Box as="p" className="text-muted-foreground text-sm -mt-4">
                      Upload documents in PNG, JPEG, or PDF format.
                    </Box>

                    {claimForms.map((item, index) => (
                      <Field name={item.name} key={index}>
                        {({ meta }) => {
                          const isMultiple =
                            item.type.toLowerCase() === ClaimFieldInputType.FileMultiple;
                          const value = isMultiple
                            ? Array.isArray(formValue[item.name])
                              ? formValue[item.name].map((v: any) => v.fileName)
                              : []
                            : formValue[item.name]?.fileName || '';

                          return (
                            <FileUpload
                              label={
                                item.label.en || item?.label_multilanguage?.en || item.label || ''
                              }
                              multiple={isMultiple}
                              value={null}
                              displayValue={value}
                              accept=".png,.jpg,.jpeg,.pdf"
                              clearable
                              onChange={async (nextValue) => {
                                const files = Array.isArray(nextValue)
                                  ? nextValue
                                  : nextValue
                                    ? [nextValue]
                                    : [];

                                if (files.length === 0) {
                                  if (!isMultiple) {
                                    handleChangeFileClaim(item.name, '', '');
                                  }
                                  return;
                                }

                                const file = files[0];
                                if (!file) return;

                                try {
                                  const base64 = await readFileAsDataUrl(file);
                                  if (!isMultiple) {
                                    handleChangeFileClaim(item.name, file.name, base64);
                                  } else {
                                    handleChangeMultipleFileClaim(
                                      index,
                                      item.name,
                                      file.name,
                                      base64,
                                    );
                                  }
                                } catch (err) {
                                  console.error('Error reading file:', err);
                                }
                              }}
                              error={meta.error && meta.touched && meta.error}
                            />
                          );
                        }}
                      </Field>
                    ))}

                    <Box
                      as="p"
                      className="text-xs text-muted-foreground italic bg-muted/30 p-3 rounded-lg border border-border/50"
                    >
                      <strong>Note:</strong> Once data has been uploaded, you can't edit it unless
                      you change the status to Lack of Documents.
                    </Box>
                  </Box>

                  <Button
                    size="lg"
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full w-fit px-10 mt-4 font-bold shadow-md"
                    onClick={handleSubmit}
                    disabled={!valid || submitting}
                  >
                    {submitting ? 'Saving...' : 'Save Documents'}
                  </Button>
                </Box>
              )}
            </Form>
          )}
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}

export default UploadData;
