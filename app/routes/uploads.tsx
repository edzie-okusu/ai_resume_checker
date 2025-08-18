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
        const data = {
            id: uuid,
            companyName,
            jobTitle,
            jobDescription,
            resumePath: uploadFile.path,
            imagePath: uploadImage.path,
            feedback: ''
        };
        await kv.set(`resume: ${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing resume...');

        const feedback = await ai.feedback(
            uploadFile.path,
            prepareInstructions({jobTitle, jobDescription, AIResponseFormat})
        )

        if (!feedback) return setStatusText('Error: Failed to analyze resume');
        
        // check if feedback is a string or an object and extract the content
        const feedbackText = typeof feedback.message.content === 'string' 
            ? feedback.message.content 
            : feedback.message.content[0].text; 
        
        // append feedback to data object
        data.feedback = JSON.parse(feedbackText);
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
        handleAnalyze( {companyName, jobTitle, jobDescription, file});
        
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