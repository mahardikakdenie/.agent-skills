import React, {useCallback} from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import UploadIcon from "@/images/upload.icon";
type ExcelDropUploadProps = {
    onDataParsed?: (data: Record<string, any>[]) => void;
    disabled: boolean;
    setFileName: any;
    fileName: string | null | undefined;
};
export const DragDropExcel: React.FC<ExcelDropUploadProps> = ({
                                                                  onDataParsed,
                                                                  disabled, setFileName, fileName
                                                              }) => {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (e) => {
            const result = e.target?.result;
            if (!result) return;

            const data = new Uint8Array(result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

            if (onDataParsed) {
                onDataParsed(jsonData);
            }
        };

        reader.readAsArrayBuffer(file);
    }, [onDataParsed]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
            "application/vnd.ms-excel": [],
        },
        multiple: false,
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed border-gray-400 p-6 rounded-lg text-center ${
                disabled ? "cursor-not-allowed bg-green-100" : "cursor-pointer"
            }`}
        >
            <input {...getInputProps()} disabled={disabled} />

            <div className="flex flex-col justify-center gap-3 items-center text-center">
                {UploadIcon()}
                {fileName ? (
                    <p className="text-sm text-gray-800 font-semibold">{fileName}</p>
                ) : isDragActive ? (
                    <p>Drop the Excel file here...</p>
                ) : (
                    <p>Drag & drop an Excel file here, or click to select</p>
                )}
            </div>
        </div>
    );
};