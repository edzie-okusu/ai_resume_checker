import Navbar from "~/components/navbar";
import type { Route } from "./+types/home";
import { resumes } from "constants";
import ResumeCard from "~/components/ResumeCard";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  //  const {isLoading, auth} = usePuterStore();

  //   // enable user  access only when authenticated
  //   const location = useLocation();
  //   const navigate = useNavigate()

  //   useEffect(() => {
  //       if(!auth.isAuthenticated) navigate('/auth?next=/');
  //   }, [auth.isAuthenticated])

    
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover items-center bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Application & Resume Ratings</h1>
          <h2>Review your adminssions and check AI-Powered feedback</h2>
        </div>
      </section>
  
      {resumes?.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        
    

  </main>
}
 