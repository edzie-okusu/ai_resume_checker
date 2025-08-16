import React, {useCallback, useState} from "react";
import {useDropzone} from 'react-dropzone'

const FilesUpload = () => {
    const {file, setFile} = useState<File | null>(null);
    const onDrop = useCallback(acceptedFiles => {

    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop}) 

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center">
                        <img src="/icons/info.svg" alt="upload" className="size-20" />
                    </div>

                    {
                        file ? (
                            <div className=""></div>
                        ) : (
                            <div className="">
                                <p className="text-lg text-gray-500">
                                    <span className="font-semi-bold">
                                        Click to upload
                                    </span> or drag and drop
                                </p>
                                <p className="text-lg text-gray-500">PDF (max 20 MB)</p>
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