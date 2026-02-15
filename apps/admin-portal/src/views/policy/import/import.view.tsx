import Button from '@/components/button';
import Input from '@/components/input';
import Modal from '@/components/modal';
import NotFound from '@/components/not-found';
import Select from '@/components/select';
import { Tooltip } from '@/components/tooltip';
import {
  primary,
  primaryRed,
  primaryRedLightForeground,
} from '@/constants/app-common.const';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import {
  capitalizeStringWithChar,
  toastNotification,
} from '@/helpers/app.helper';
import AlertCircleIcon from '@/images/alert-circle.icon';
import EditIcon from '@/images/edit.icon';
import { claimsService } from '@/services/claims/api/claims.service';
import { productService } from '@/services/product/api/product.service';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'react-feather';
// import { useCSVReader } from 'react-papaparse';
import {DragDropExcel} from "@/components/drag-drop-excel";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from "@/images/download.icon";

const GREY = '#CCC';
const GREY_LIGHT = 'rgba(255, 255, 255, 0.4)';

// const styles = {
//   zone: {
//     alignItems: 'center',
//     border: `2px dashed ${GREY}`,
//     borderRadius: 20,
//     display: 'flex',
//     flexDirection: 'column',
//     height: '100%',
//     justifyContent: 'center',
//     padding: 20,
//     width: '100%',
//   } as CSSProperties,
//   file: {
//     background: 'linear-gradient(to bottom, #EEE, #DDD)',
//     borderRadius: 20,
//     display: 'flex',
//     height: 120,
//     width: 120,
//     position: 'relative',
//     zIndex: 10,
//     flexDirection: 'column',
//     justifyContent: 'center',
//   } as CSSProperties,
//   info: {
//     alignItems: 'center',
//     display: 'flex',
//     flexDirection: 'column',
//     paddingLeft: 10,
//     paddingRight: 10,
//   } as CSSProperties,
//   size: {
//     backgroundColor: GREY_LIGHT,
//     borderRadius: 3,
//     marginBottom: '0.5em',
//     justifyContent: 'center',
//     display: 'flex',
//   } as CSSProperties,
//   name: {
//     backgroundColor: GREY_LIGHT,
//     borderRadius: 3,
//     fontSize: 12,
//     marginBottom: '0.5em',
//   } as CSSProperties,
//   progressBar: {
//     bottom: 14,
//     position: 'absolute',
//     width: '100%',
//     paddingLeft: 10,
//     paddingRight: 10,
//   } as CSSProperties,
//   remove: {
//     height: 23,
//     position: 'absolute',
//     right: 6,
//     top: 6,
//     width: 23,
//   } as CSSProperties,
// };

export const ClaimImportView = () => {
  const { handleResponseError } = useAuth();
  const { isMobileView, setLoading } = useScreen();
  const router = useRouter();
  const reportTemplateRef = useRef(null);
  // const { CSVReader } = useCSVReader();
  const [headerCSV, setHeaderCSV] = useState<string[]>([]);
  const [dataCSV, setDataCSV] = useState<any[]>([]);
  const [isModalEditHeader, setIsModalEditHeader] = useState<boolean>(false);
  const [indexHeader, setIndexHeader] = useState<number>(0);
  const [selectedHeader, setSelectedHeader] = useState('');
  const [optionHeaderList, setOptionHeaderlist] = useState<
    { label: string; value: string; disable?: boolean }[]
  >([]);
  const [newLabelHeader, setNewLabelHeader] = useState('');
  const [newTypeHeader, setNewTypeHeader] = useState('');
  const [checkedHeaderList, setCheckedHeaderList] = useState<
    {
      field: string;
      required: boolean;
    }[]
  >([]);
  const [optionDataTypeList, setOptionDataTypeList] = useState<
    { label: string; value: string }[]
  >([
    { label: 'Text', value: 'text' },
    { label: 'Number', value: 'number' },
    { label: 'Date', value: 'date' },
    { label: 'Boolean', value: 'boolean' },
  ]);
  const [optionCategoryList, setOptionCategoryList] = useState<
    { label: string; value: string }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [validateHeader, setValidateHeader] = useState<boolean[]>([]);
  const { user } = useAuth();
  const [jsonHeader, setJsonHeader] = useState<any[]>([]);
  const checkAllRequiredHeader = (listHeaderCSV?: any[]) => {
    const filterRequiredHeader = checkedHeaderList.filter((v) => v.required);
    const filterHeaderSubmited = (listHeaderCSV || [...headerCSV]).filter(
      (_, index) => validateHeader[index],
    );

    const filterHeaderSubmitedSet = validateHeader.length
      ? new Set(filterHeaderSubmited)
      : new Set(listHeaderCSV || [...headerCSV]);
    return filterRequiredHeader.every((item) =>
      filterHeaderSubmitedSet.has(item.field),
    );
  };
  const [fileName, setFileName] = useState<string>();
  useEffect(() => {
    if (!checkAllRequiredHeader()) {
      setErrorMessage('You must match all required column to import.');
    } else {
      setErrorMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedHeaderList, headerCSV, validateHeader]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response: any = await productService.getCategoriesByChannelId(user?.channel || '');
      if (response) {
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];
        setOptionCategoryList(
          list.map((item: any) => ({
            label: capitalizeStringWithChar(item.name),
            value: item.id,
          })),
        );
        // if (list.length === 1) {
        //   setSelectedCategory(list[0].id.toString());
        // }
      }
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImportGuide = async (categoryId: string) => {
    try {
      setLoading(true);
      const responseClaim: any = await claimsService.getImportDataGuide({
        channel: user.channel,
        category: categoryId,
      } as any);
      const responseHeader = responseClaim?.[0]?.data;
      if (responseHeader) {
        setCheckedHeaderList(responseHeader);
        setOptionHeaderlist(
          responseHeader?.map((v: any) => {
            return {
              label: `${v?.field} ${v?.required ? '(Required)' : ''}`,
              value: v?.field,
            };
          }),
        );
        setJsonHeader(responseHeader)
      } else {
        toastNotification('Header guide not found!!', 'error');
        setCheckedHeaderList([]);
        setOptionHeaderlist([]);
      }
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitImport = async () => {
    try {
      setLoading(true);
      const filteredHeaders = headerCSV
          .map((key, index) => (validateHeader[index] ? { key, index } : null))
          .filter((item): item is { key: string; index: number } => item !== null);

      const result = dataCSV.map((row) =>
          Object.fromEntries(
              filteredHeaders.map(({ key, index }) => [key, row[index]])
          )
      );
      const payload = {
        channel: user?.channel || '',
        category: selectedCategory,
        data: result,
      };

      await claimsService.importClaimsAsJson(payload);
      toastNotification('Success!!', 'success');
      router.push(AppURL.claimList);
    } catch (error: any) {
      toastNotification(
        `${error?.response?.data?.message || 'Error!!'}`,
        'error',
      );
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const stylesClaimData = {
    table: {
      width: '100%',
      border: '0.5px solid #cccccc',
    },
    th: {
      border: '0.5px solid #cccccc',
      fontWeight: 'bold',
      fontSize: '12px',
      height: 'auto',
      verticalAlign: 'middle',
    },
    td: {
      padding: '10px',
      height: 'auto',
      border: '0.5px solid #cccccc',
      fontSize: '12px',
      verticalAlign: 'middle',
    },
  };

  const clear = () => {
    setHeaderCSV([]);
    setDataCSV([]);
    setValidateHeader([]);

    setSelectedHeader('');
    setNewLabelHeader('');
    setNewTypeHeader('');
  };

  const handleSelectedHeader = (index: number, header: string) => {
    const newOptionHeader = [...optionHeaderList].map((v) => {
      if (headerCSV.includes(v.value)) {
        v.disable = true;
      } else {
        v.disable = false;
      }

      if (v.value === header) {
        v.disable = false;
      }
      return v;
    });

    setOptionHeaderlist(newOptionHeader);

    setIsModalEditHeader(true);
    setIndexHeader(index);
    setSelectedHeader(header);
  };

  const checkValidateHeaders = (listCheckHeader: any[], listHeader: any[]) => {
    const fieldCount: Record<string, number> = {};
    const fieldMap = new Set(listCheckHeader.map((item) => item.field));

    listHeader.forEach((field) => {
      fieldCount[field] = (fieldCount[field] || 0) + 1;
    });

    return listHeader.map((field) =>
      fieldCount[field] > 1 ? false : fieldMap.has(field),
    );
  };

  const handleImport = async (results: any) => {
    try {
      setLoading(true);
      let newDataCSV = [...results.data];
      newDataCSV.shift();

      const newHeaderCSV = results.data[0];

      const newarr = checkValidateHeaders(checkedHeaderList, newHeaderCSV);
      setValidateHeader(newarr);

      setHeaderCSV(newHeaderCSV);
      setDataCSV(newDataCSV);
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckSelectedHeader = (index: number) => {
    const newValidateHeader = [...validateHeader];
    newValidateHeader[index] = !newValidateHeader[index];

    setValidateHeader(newValidateHeader);
  };

  const checkSameHeader = (header?: string, index?: number) => {
    let checkHeader = header || '';
    if (index !== undefined) {
      checkHeader = headerCSV[index || 0] || '';
    }
    const fieldCount: Record<string, number> = {};
    const fieldMap = new Set(checkedHeaderList.map((item) => item.field));
    headerCSV.forEach((field) => {
      fieldCount[field] = (fieldCount[field] || 0) + 1;
    });
    return fieldCount[checkHeader] > 1 ? false : fieldMap.has(checkHeader);
  };

  const handleSelectCategory = (value: string) => {
    if (selectedCategory !== value) {
      clear();
    }
    fetchImportGuide(value.toString());
    setSelectedCategory(value.toString());
  };
  const handleExcelData = (data: Record<string, any>[]) => {
    const headers = Object.keys(data[0]);
    setHeaderCSV(Object.keys(data[0]))
    const formattedData = data.map((row) =>
        headers.map((key) => String(row[key] ?? ""))
    );
    setValidateHeader(new Array(headers.length).fill(true));
    setDataCSV(formattedData);
  };

  const exportToExcel = () => {
    const headers = jsonHeader.map(item => item?.field);

    const dataAsObject = headers.reduce((acc, header, index) => {
      acc[header] = '';
      return acc;
    }, {});

    const worksheet = XLSX.utils.json_to_sheet([dataAsObject]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "example-template.xlsx");
  };

  return (
    <div className="mx-auto py-5 px-7">
      <div className="lg:flex lg:items-center lg:justify-between lg:mb-3">
        <div className="flex items-center justify-between mb-5">
          <p className="font-bold text-lg lg:mt-2">Import Claim List</p>

          {isMobileView && (
            <div
              onClick={() => router.push(AppURL.claimList)}
              className="ml-auto items-center flex gap-1 text-red-500 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </div>
          )}
        </div>

        {!isMobileView && (
          <div
            onClick={() => router.push(AppURL.claimList)}
            className="ml-auto items-center flex gap-1 text-red-500 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </div>
        )}

        { selectedCategory &&
            <div className="lg:ml-5">
              <Button
                  className="w-full lg:w-fit flex justify-center lg:justify-between mr-0 mb-3 lg:mb-0"
                  onClick={exportToExcel}>
                <span className={`flex gap-2`}>{DownloadIcon("#ffffff")} Download Template</span>
              </Button>
            </div>
        }

        {!!headerCSV.length && !!dataCSV.length && (
          <>
            <div className="lg:ml-5">
              <Button
                variant="danger"
                additionalClassName="w-full lg:w-fit justify-center lg:justify-between mr-0 mb-3 lg:mb-0"
                onClick={() => clear()}
              >
                <span className="mx-3.5">Cancel</span>
              </Button>
            </div>
            <div className="mb-5 lg:mb-0 lg:ml-3">
              <Button
                additionalClassName="w-full lg:w-fit justify-center lg:justify-between mr-0 mb-3 lg:mb-0"
                onClick={submitImport}
                disabled={!!errorMessage}
              >
                <span className="mx-3.5">Upload</span>
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
        <div className="mb-3 w-full">
          <p className="mb-2 text-sm font-medium">Select Category</p>
          <div className={`flex items-center gap-2`}>
            <div className={`flex-1`}>
              <Select
                chevronColor={primary}
                placeholderSelectClassName="truncate"
                additionalClassNameSelect="pl-4 h-[46px]"
                value={selectedCategory}
                onChange={(value) => handleSelectCategory(value.toString())}
                options={optionCategoryList}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedCategory &&
        (!!checkedHeaderList.length || !!optionHeaderList.length) && (
          <div className="w-full rounded-lg mb-5">
            {headerCSV.length && dataCSV.length ? (
              <>
                <div className={`mb-5`}>
                <DragDropExcel disabled={true} onDataParsed={handleExcelData} setFileName={setFileName} fileName={fileName}/>
                </div>
                <div className="flex">
                  {errorMessage ? (
                    <p className="mb-2 text-xs text-red-500">{errorMessage}</p>
                  ) : (
                    <p className="mb-2 text-xs">
                      <span className="font-semibold">
                        {`${validateHeader.filter(Boolean).length} `}
                      </span>
                      columns will be imported.
                      <span className="font-semibold">
                        {` ${validateHeader.filter((v) => !v).length} `}
                      </span>{' '}
                      columns will not be imported.
                    </p>
                  )}
                </div>
                <div className="overflow-x-auto sm:scrollable">
                  <table
                    style={stylesClaimData.table}
                    ref={reportTemplateRef}
                    border={1}
                  >
                    <thead>
                      <tr>
                        {headerCSV.map((header, index) => (
                          <td
                            key={index}
                            style={{
                              ...stylesClaimData.th,
                              background: !checkSameHeader(header)
                                ? primaryRed
                                : '#e7e7e7',
                            }}
                            valign="middle"
                          >
                            <Tooltip
                              content="Edit the column name to resolve the error"
                              position="top"
                              isShow={!checkSameHeader(header)}
                            >
                              <div className="flex items-center p-2 gap-2">
                                <span
                                  onClick={() =>
                                    handleSelectedHeader(index, header)
                                  }
                                  style={{
                                    color: !checkSameHeader(header)
                                      ? primaryRedLightForeground
                                      : '',
                                  }}
                                  className={`flex items-center p-2 gap-x-0.5 cursor-pointer truncate ${
                                    checkSameHeader(header) &&
                                    `hover:bg-primary-foreground`
                                  }
                                  `}
                                >
                                  {EditIcon(
                                    checkSameHeader(header)
                                      ? primary
                                      : primaryRedLightForeground,
                                    '20',
                                    '20',
                                    '0 0 24 24',
                                  )}
                                  {header}
                                </span>
                                {checkSameHeader(header) ? (
                                  <input
                                    type="checkbox"
                                    className="custom-checkbox"
                                    checked={!!validateHeader[index]}
                                    onChange={() =>
                                      handleCheckSelectedHeader(index)
                                    }
                                  />
                                ) : (
                                  AlertCircleIcon(
                                    primaryRedLightForeground,
                                    '20',
                                    '20',
                                    '0 0 24 24',
                                  )
                                )}
                              </div>
                            </Tooltip>
                          </td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataCSV.map((item, index) => (
                        <tr key={index}>
                          {[...item].map((subItem, subIndex) => (
                            <td
                              key={subIndex}
                              style={{
                                ...stylesClaimData.td,
                                background: validateHeader[subIndex]
                                  ? 'bg-white'
                                  : !checkSameHeader('', subIndex) &&
                                    !validateHeader[subIndex]
                                  ? primaryRedLightForeground
                                  : 'bg-[#e7e7e7]',
                              }}
                              valign="middle"
                            >
                              {subItem}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              // <CSVReader
              //   onUploadAccepted={(results: any) => handleImport(results)}
              //   onDragOver={(event: DragEvent) => {
              //     event.preventDefault();
              //   }}
              //   onDragLeave={(event: DragEvent) => {
              //     event.preventDefault();
              //   }}
              //   onUploadRejected={() =>
              //     toastNotification('File must be csv!!', 'error')
              //   }
              //   config={{
              //     skipEmptyLines: true,
              //   }}
              // >
              //   {({ getRootProps }: any) => (
              //     <>
              //       <div {...getRootProps()} style={styles.zone}>
              //         Drop CSV file here or click to upload
              //       </div>
              //     </>
              //   )}
              // </CSVReader>
                <DragDropExcel disabled={false} onDataParsed={handleExcelData} setFileName={setFileName} fileName={fileName}/>
            )}
          </div>
        )}

      {dataCSV.length < 1 && (
        <div className="flex items-center justify-center bg-white rounded-md py-20 shadow mt-2">
          <NotFound
            width={isMobileView && '143'}
            height={isMobileView && '144'}
            size1={isMobileView && '143'}
            size3={isMobileView && '95'}
            viewBox={isMobileView && '0 0 70 70'}
            text="No data available"
            textClassName={isMobileView && 'text-xs'}
          />
        </div>
      )}

      <Modal
        isOpen={isModalEditHeader}
        onClose={() => setIsModalEditHeader(false)}
        widthClassName="w-full lg:w-[500px]"
        heightClassName="h-fit"
      >
        <div className="py-6 px-4">
          <h1 className="font-bold text-lg text-center mb-5">
            Edit column label
          </h1>
          <div className="grid mb-5">
            <div className="mb-3">
              <p className="mb-2 text-sm font-medium">
                Select a field for this column
              </p>
              <Select
                chevronColor={primary}
                placeholderSelectClassName="truncate"
                additionalClassNameSelect="pl-4 h-[46px]"
                value={selectedHeader}
                onChange={(value) => {
                  setSelectedHeader(value.toString());
                }}
                options={optionHeaderList}
              />
            </div>

            {selectedHeader === 'add' && (
              <div className="">
                <div className="mb-3">
                  <p className="mb-2 text-sm font-medium">
                    Create a field label
                  </p>
                  <Input
                    value={newLabelHeader}
                    onChange={(value) => {
                      if (value.toString() !== 'add')
                        setNewLabelHeader(value.toString());
                    }}
                    onClear={() => setNewLabelHeader('')}
                    placeholder="Input your field"
                  />
                </div>
                <div className="mb3">
                  <p className="mb-2 text-sm font-medium">Select a data type</p>
                  <Select
                    chevronColor={primary}
                    placeholderSelectClassName="truncate"
                    additionalClassNameSelect="pl-4 h-[46px]"
                    value={newTypeHeader}
                    onChange={(value) => {
                      setNewTypeHeader(value.toString());
                    }}
                    options={optionDataTypeList}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center text-center">
            <Button
              variant="danger"
              additionalClassName="mr-2"
              onClick={() => setIsModalEditHeader(false)}
            >
              <span className="mx-3.5">Cancel</span>
            </Button>
            <Button
              onClick={() => {
                setHeaderCSV((prevItems) =>
                  prevItems.map((item, i) => {
                    if (i === indexHeader) {
                      if (selectedHeader === 'add') {
                        return newLabelHeader;
                      }
                      return selectedHeader;
                    }
                    return item;
                  }),
                );
                if (newLabelHeader) {
                  const newData = {
                    label: newLabelHeader,
                    value: newLabelHeader,
                  };
                  setOptionHeaderlist((prev) => [...prev, newData]);
                }
                const newValidateHeader = [...validateHeader];
                newValidateHeader[indexHeader] =
                  !newValidateHeader[indexHeader];

                setValidateHeader(newValidateHeader);
                setIsModalEditHeader(false);
                setNewLabelHeader('');
                setNewTypeHeader('');
              }}
            >
              <span className={`mx-3 `}>Confirm</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
