import React, {useCallback, useState} from "react";
import {useDropzone} from 'react-dropzone'
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FilesUpload = ({onFileSelect}: FileUploaderProps) => {


    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];

        onFileSelect?.(file)
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20 MB

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop, 
        multiple: false,
        accept: {'application/pdf': ['.pdf']},
        maxSize: maxFileSize
    }) 
    
    const file = acceptedFiles[0];
    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
 
                <div className="space-y-4 cursor-pointer">

                    {
                        file ? (
                            <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                                 <img src="/images/pdf.png" alt="pdf" className="size-10" />
                                <div className="flex items-center space-x-3">
                                    <div className="">
                                        <p className="text-lg text-gray-700">{file.name}</p>
                                        <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                                    </div>
                                </div>
                                <button className="p-2 cursor-pointer" onClick={(e) => {
                                    onFileSelect?.(null)
                                }}>
                                    <img src="/icons/cross.svg" alt="remove" className="w-4 h-4"/>
                                </button>
                            </div>
                        ) : (
                            <div className="">
                                <div className="mx-auto w-16 h-16 flex items-center justify-center">
                                    <img src="/icons/info.svg" alt="upload" className="size-20" />
                                </div>

                                <p className="text-lg text-gray-500">
                                    <span className="font-semi-bold">
                                        Click to upload
                                    </span> or drag and drop
                                </p>
                                <p className="text-lg text-gray-500">PDF (max (20 MB))</p>
                            </div>
                        )
                    }


                </div>
                {/* {
                    isDragActive ?
                        <p>Drop the files here ...</p>:
                        <p>Drag 'n' drop some files here, or click to select files</p>
                } */}
            </div>

        </div>
    )
}

export default FilesUpload;

// download react drop zone
// npm install react-dropzone