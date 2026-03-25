"use client";
import noData from "@public/images/no-data.webp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Download } from "react-feather";
import { Button } from "@/components/ui/button";
import { Spinner } from "@repo/ui";
import useExportPolicy from "@/hooks/useExportPolicy.hooks";

export default function ExportPage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isGeneratingXlsx,
    isShowPremi,
    isShowDanaInfo,
    reportTemplateRef,
    handleGeneratePdf,
    handleGenerateXlsx,
  } = useExportPolicy();

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
        <h1 className="text-black font-bold text-2xl mt-2">Policy List</h1>
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
          disabled={isGeneratingXlsx}
          className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingXlsx ? (
            <>
              <Spinner
                inline
                className="mr-2 [&_[data-slot=spinner-icon]]:size-6 [&_[data-slot=spinner-icon]]:text-blue-500"
              />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-1 " /> Generate XLSX
            </>
          )}
        </Button>
      </div>
      <div className="w-full bg-white rounded-lg">
        {isLoading ? (
          <div className="flex gap-2 flex-col justify-center items-center py-20 text-sm">
            <Spinner
              inline
              className="[&_[data-slot=spinner-icon]]:size-10 [&_[data-slot=spinner-icon]]:text-blue-500"
            />
            Loading...
          </div>
        ) : (
          <table style={styles.table} ref={reportTemplateRef} border={1}>
            <thead>
              <tr>
                <td style={styles.th} valign="middle">
                  No.
                </td>
                <td style={styles.th} valign="middle">
                  Customer Name
                </td>
                <td style={styles.th} valign="middle">
                  Policy Number
                </td>
                <td style={styles.th} valign="middle">
                  Plan Name
                </td>
                <td style={styles.th} valign="middle">
                  Status
                </td>
                {isShowPremi && (
                  <td style={styles.th} valign="middle">
                    Premium
                  </td>
                )}
                {isShowDanaInfo && (
                  <>
                    <td style={styles.th} valign="middle">
                      Order Id
                    </td>
                    <td style={styles.th} valign="middle">
                      Request Id
                    </td>
                    <td style={styles.th} valign="middle">
                      License Plate
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
                        {item.policy_holder?.name || "-"}
                      </div>
                    </td>
                    <td style={styles.td} valign="middle">
                      {item?.number || "-"}
                    </td>
                    <td style={styles.td} valign="middle">
                      {item?.policy_products?.plan_data?.name
                        .split("|")
                        .join(" - ") || "-"}
                    </td>
                    <td
                      style={styles.td}
                      valign="middle"
                      className="whitespace-nowrap"
                    >
                      {item.status || "-"}
                    </td>
                    {isShowPremi && (
                      <td style={styles.td} valign="middle">
                        {item.declarations?.transaction_data?.insurance
                          ?.premium || "-"}
                      </td>
                    )}
                    {isShowDanaInfo &&
                      (item.declarations?.transaction_data?.third_party
                        ?.provider === "DANA" ? (
                        <>
                          <td style={styles.td} valign="middle">
                            {item.declarations?.transaction_data?.third_party
                              ?.identifiers?.order_id || "-"}
                          </td>
                          <td style={styles.td} valign="middle">
                            {item.declarations?.transaction_data?.third_party
                              ?.identifiers?.request_id || "-"}
                          </td>
                          <td style={styles.td} valign="middle">
                            {item.declarations?.transaction_data
                              ?.participants[0]?.data?.licensePlate ||
                              item.declarations?.transaction_data
                                ?.participants[0]?.data?.plat_number ||
                              "-"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={styles.td} valign="middle">
                            -
                          </td>
                          <td style={styles.td} valign="middle">
                            -
                          </td>
                          <td style={styles.td} valign="middle">
                            -
                          </td>
                        </>
                      ))}
                  </tr>
                ))
              ) : (
                <tr className="hover:!bg-white">
                  <td colSpan={5}>
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

