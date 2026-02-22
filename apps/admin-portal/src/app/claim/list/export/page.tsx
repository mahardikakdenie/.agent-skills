// "use client";
//
// import React from "react";
// import {ClaimExportView} from "@/views/claim/export/export.view";
//
// export default function ClaimExportPage() {
//     return <ClaimExportView />;
// }

"use client";
"use client";
import noData from "@public/images/no-data.webp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Download } from "react-feather";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import useExportClaim from "@/hooks/useExportClaim.hooks";

export default function ExportPage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isGrabExpress,
    reportTemplateRef,
    handleGeneratePdf,
    handleGenerateXlsx,
    getReqAmountUi,
    getApprovedAmountUi,
    getClaimConfigValue,
  } = useExportClaim();

  const styles = {
    table: {
      width: "100%",
      border: "0.5px solid #cccccc",
    },
    th: {
      padding: "10px",
      border: "0.5px solid #cccccc",
      fontWeight: "bold",
      fontSize: "12px",
      height: "auto",
      background: "#e7e7e7",
      verticalAlign: "middle",
    },
    td: {
      padding: "10px",
      height: "auto",
      border: "0.5px solid #cccccc",
      fontSize: "12px",
      verticalAlign: "middle",
    },
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6 h-screen overflow-auto">
      <div className="flex gap-4 mb-5">
        <h1 className="text-black font-bold text-2xl mt-2">Claim List</h1>
        <div
          onClick={() => router.back()}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </div>

        <Button
          onClick={handleGeneratePdf}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs"
        >
          <Download className="w-5 h-5 mr-1 " /> Generate PDF
        </Button>

        <Button
          onClick={handleGenerateXlsx}
          className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs"
        >
          <Download className="w-5 h-5 mr-1 " /> Generate XLSX
        </Button>
      </div>
      <div className="w-full bg-white rounded-lg">
        {isLoading ? (
          <div className="flex gap-2 flex-col justify-center items-center py-20 text-sm">
            <Spinner /> Loading...
          </div>
        ) : (
          <table style={styles.table} ref={reportTemplateRef} border={1}>
            <thead>
              <tr>
                <td style={styles.th} valign="middle">
                  No.
                </td>
                <td style={styles.th} valign="middle">
                  Claim ID
                </td>
                <td style={styles.th} valign="middle">
                  Customer Name
                </td>
                <td style={styles.th} valign="middle">
                  Plan Name
                </td>
                <td style={styles.th} valign="middle">
                  Benefit
                </td>
                <td style={styles.th} valign="middle">
                  Currency
                </td>
                <td style={styles.th} valign="middle">
                  Requested Amount
                </td>
                <td style={styles.th} valign="middle">
                  Approved Amount{" "}
                </td>
                <td style={styles.th} valign="middle">
                  Status
                </td>
                {isGrabExpress && (
                  <>
                    <td style={styles.th} valign="middle">
                      Booking ID
                    </td>
                    <td style={styles.th} valign="middle">
                      Tanggal Claim
                    </td>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id}>
                    <td style={styles.td} valign="middle">
                      {index + 1}
                    </td>
                    <td style={styles.td} valign="middle">
                      <div className="flex gap-2 items-center">
                        {item.number || "-"}
                      </div>
                    </td>
                    <td style={styles.td} valign="middle">
                      {item?.policy_data?.policy_holder?.name || "-"}
                    </td>
                    <td style={styles.td} valign="middle">
                      {item?.package?.plan?.name.split("|").join(" - ") || "-"}
                    </td>
                    <td style={styles.td} valign="middle">
                      {item?.benefit?.description_en || "-"}
                    </td>
                    <td style={styles.td} valign="middle">
                      {item?.currency || "-"}
                    </td>
                    <td style={styles.td} valign="middle">
                      {getReqAmountUi(item)}
                    </td>
                    <td style={styles.td} valign="middle">
                      <div className="flex gap-2 items-center">
                        {getApprovedAmountUi(item)}
                      </div>
                    </td>
                    <td style={styles.td} valign="middle">
                      {item.status}
                    </td>
                    {isGrabExpress && (
                      <>
                        <td style={styles.td} valign="middle">
                          {getClaimConfigValue(item, "order_id")}
                        </td>
                        <td style={styles.td} valign="middle">
                          {getClaimConfigValue(item, "datetime_loss_damage")}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr className="hover:!bg-white">
                  <td colSpan={isGrabExpress ? 11 : 9}>
                    <div className="flex flex-col gap-4 items-center justify-center py-14">
                      <Image alt="no data" src={noData} width={200} /> No
                      transaction data available
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

