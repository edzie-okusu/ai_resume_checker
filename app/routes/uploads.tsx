import { AIResponseFormat, prepareInstructions } from "constants/index";
import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FilesUpload from "~/components/FilesUpload";
import Navbar from "~/components/navbar";
import { convertPdfToImage } from "~/lib/pdfToImage";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const Uploads = () => {
    const navigate = useNavigate();
    const {auth, fs, ai, isLoading, kv} = usePuterStore();
    const [ isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyze = async ({companyName, jobDescription, jobTitle, file}: {companyName:string, jobDescription:string, jobTitle:string, file:File}) => {
        setIsProcessing(true);
        setStatusText('Uploading file...');
        const uploadFile = await fs.upload([file])

        if(!uploadFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
       if (!imageFile || !imageFile.file) return setStatusText('Error: Failed to convert pdf to Image');

        setStatusText('Uploading image...');
        const uploadImage = await fs.upload([imageFile.file]);

        if(!uploadImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');

        const uuid = generateUUID();
        

        setStatusText('Analyzing resume...');

        const feedback = await ai.feedback(
            uploadFile.path,
            prepareInstructions({jobTitle, jobDescription, AIResponseFormat})
        )

        if (!feedback) return setStatusText('Error: Failed to analyze resume');
        
        // check if feedback is a string or an object and extract the content
        const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text; 
        console.log('feedbackText', feedbackText);
        let parsedFeedback = null;
        try {
          parsedFeedback = JSON.parse(feedbackText);
        } catch (e) {
          setStatusText('Error: Feedback format invalid');
          setIsProcessing(false);
          return;
        }

        const data = {
            id: uuid,
            companyName,
            jobTitle,
            jobDescription,
            resumePath: uploadFile.path,
            imagePath: uploadImage.path,
            feedback: parsedFeedback
        };
        // data.feedback = parsedFeedback;
        await kv.set(`resume: ${uuid}`, JSON.stringify(data));

        setStatusText('Analysis complete! Redirecting to results...');
        console.log(data);
        navigate(`/resume/${uuid}`);

    }   

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title')  as string;
        const jobDescription = formData.get('job-description')  as string;
        
        if (!file) return;
        handleAnalyze({companyName, jobTitle, jobDescription, file});
        
    }
    return (

        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>

                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ): (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}

                    {!isProcessing && (
                        <form action="" id="upload-form" onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                             <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                             <input type="text" name="company-name" placeholder="company-name" />
                            
                             </div>
                             
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                             <input type="text" name="job-title" placeholder="job-title" />

                            </div>
                             
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                             <textarea rows={5} name="job-description" placeholder="Job Description" />
                                
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FilesUpload onFileSelect={handleFileSelect}/> 
                            </div>

                            <button className="primary-button" type="submit">Submit Resume</button>
                             
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Uploads;

// import {type FormEvent, useState} from 'react'
// import Navbar from "~/components/navbar";
// import FileUploader from "~/components/FilesUpload";
// import {usePuterStore} from "~/lib/puter";
// import {useNavigate} from "react-router";
// import {convertPdfToImage} from "~/lib/pdfToImage";
// import {generateUUID} from "~/lib/utils";
// import {prepareInstructions, AIResponseFormat} from "../../constants/index";

// const Upload = () => {
//     const { auth, isLoading, fs, ai, kv } = usePuterStore();
//     const navigate = useNavigate();
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [statusText, setStatusText] = useState('');
//     const [file, setFile] = useState<File | null>(null);

//     const handleFileSelect = (file: File | null) => {
//         setFile(file)
//     }

//     const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
//         setIsProcessing(true);

//         setStatusText('Uploading the file...');
//         const uploadedFile = await fs.upload([file]);
//         if(!uploadedFile) return setStatusText('Error: Failed to upload file');

//         setStatusText('Converting to image...');
//         const imageFile = await convertPdfToImage(file);
//         if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

//         setStatusText('Uploading the image...');
//         const uploadedImage = await fs.upload([imageFile.file]);
//         if(!uploadedImage) return setStatusText('Error: Failed to upload image');

//         setStatusText('Preparing data...');
//         const uuid = generateUUID();
//         const data = {
//             id: uuid,
//             resumePath: uploadedFile.path,
//             imagePath: uploadedImage.path,
//             companyName, jobTitle, jobDescription,
//             feedback: '',
//         }
//         await kv.set(`resume:${uuid}`, JSON.stringify(data));

//         setStatusText('Analyzing...');

//         const feedback = await ai.feedback(
//             uploadedFile.path,
//             prepareInstructions({ jobTitle, jobDescription, AIResponseFormat })
//         )
//         if (!feedback) return setStatusText('Error: Failed to analyze resume');

//         const feedbackText = typeof feedback.message.content === 'string'? feedback.message.content: feedback.message.content[0].text;

//         data.feedback = JSON.parse(feedbackText);
//         await kv.set(`resume:${uuid}`, JSON.stringify(data));
//         setStatusText('Analysis complete, redirecting...');
//         console.log(data);
//         navigate(`/resume/${uuid}`);
//     }

//     const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const form = e.currentTarget.closest('form');
//         if(!form) return;
//         const formData = new FormData(form);

//         const companyName = formData.get('company-name') as string;
//         const jobTitle = formData.get('job-title') as string;
//         const jobDescription = formData.get('job-description') as string;

//         if(!file) return;

//         handleAnalyze({ companyName, jobTitle, jobDescription, file });
//     }

//     return (
//         <main className="bg-[url('/images/bg-main.svg')] bg-cover">
//             <Navbar />

//             <section className="main-section">
//                 <div className="page-heading py-16">
//                     <h1>Smart feedback for your dream job</h1>
//                     {isProcessing ? (
//                         <>
//                             <h2>{statusText}</h2>
//                             <img src="/images/resume-scan.gif" className="w-full" />
//                         </>
//                     ) : (
//                         <h2>Drop your resume for an ATS score and improvement tips</h2>
//                     )}
//                     {!isProcessing && (
//                         <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
//                             <div className="form-div">
//                                 <label htmlFor="company-name">Company Name</label>
//                                 <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
//                             </div>
//                             <div className="form-div">
//                                 <label htmlFor="job-title">Job Title</label>
//                                 <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
//                             </div>
//                             <div className="form-div">
//                                 <label htmlFor="job-description">Job Description</label>
//                                 <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
//                             </div>

//                             <div className="form-div">
//                                 <label htmlFor="uploader">Upload Resume</label>
//                                 <FileUploader onFileSelect={handleFileSelect} />
//                             </div>

//                             <button className="primary-button" type="submit">
//                                 Analyze Resume
//                             </button>
//                         </form>
//                     )}
//                 </div>
//             </section>
//         </main>
//     )
// }
// export default Upload