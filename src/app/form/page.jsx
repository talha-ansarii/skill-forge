"use client";
import Link from "next/link";
import { useSession } from 'next-auth/react'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "../../../lib/utils";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const MedicalForm = () => {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [skills, setSkills] = useState([""]); // Array of skills
  const [interests, setInterests] = useState([""]); // Array of interests
  const [certificates, setCertificates] = useState([""]); // Array of certificates
  const [email , setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {

    const fetchSession = async () => {
      const session = await fetch("/api/auth/session")
      const data = await session.json()
      console.log(data.user.email)
      setEmail(data.user.email)
    }
    fetchSession()
   
  }, []);


  const handleSubmit = async (e) => {

    
    e.preventDefault();
  
    const formData = new FormData();
  
    // Append skills, interests, and certificates as arrays
    formData.append("skills", JSON.stringify(skills.filter((skill) => skill.trim() !== "")));
    formData.append("interests", JSON.stringify(interests.filter((interest) => interest.trim() !== "")));
    formData.append("certificates", JSON.stringify(certificates.filter((cert) => cert.trim() !== "")));
  
    // Append other form fields
    formData.append("experience", e.target.elements.experience.value);
    formData.append("education", e.target.elements.education.value);
    formData.append("time", e.target.elements.time.value);
    formData.append("careerPath", e.target.elements.careerPath.value);
    formData.append("email", email);
    console.log(email)
    // Validate that no required fields are empty
    if ([...formData.values()].some((value) => value === "" || value === "[]")) {
      console.log("Please fill all the fields");
     
      return;
    }
  
    // Log form data for debugging
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    try {
      setLoading(true);
      const res = await fetch("/api/form", {
        method: "POST",
        body: formData,
      });
    
      if (res.status === 400) {
        console.log("Error");
      } else if (res.status === 200) {
        const data = await res.json();
        setLoading(false);
        window.location.href = "/roadmap";
        setResult(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to handle adding/removing skills
  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const removeSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  // Function to handle adding/removing interests
  const handleInterestChange = (index, value) => {
    const newInterests = [...interests];
    newInterests[index] = value;
    setInterests(newInterests);
  };

  const addInterest = () => {
    setInterests([...interests, ""]);
  };

  const removeInterest = (index) => {
    const newInterests = interests.filter((_, i) => i !== index);
    setInterests(newInterests);
  };

  // Function to handle adding/removing certificates
  const handleCertificateChange = (index, value) => {
    const newCertificates = [...certificates];
    newCertificates[index] = value;
    setCertificates(newCertificates);
  };

  const addCertificate = () => {
    setCertificates([...certificates, ""]);
  };

  const removeCertificate = (index) => {
    const newCertificates = certificates.filter((_, i) => i !== index);
    setCertificates(newCertificates);
  };

  return (
    true && (
      <div className="bg-gradient-to-b from-[#020024] via-[#090979] to-[#053842] bg-cover py-10 min-h-screen">
        <div className="max-w-3xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
          {true ? (
            <>
              <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
                User Form
              </h2>
              <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                Please provide your information
              </p>

              <form className="my-8" onSubmit={handleSubmit}>
                {/* Skills */}
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="skills">Skills</Label>
                  {skills.map((skill, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        id={`skill-${index}`}
                        name={`skill-${index}`}
                        placeholder="Enter a skill"
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                      />
                      {skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-[#152da5] text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    + Add Skill
                  </button>
                </LabelInputContainer>

                {/* Interests */}
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="interests">Interests</Label>
                  {interests.map((interest, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        id={`interest-${index}`}
                        name={`interest-${index}`}
                        placeholder="Enter an interest"
                        type="text"
                        value={interest}
                        onChange={(e) => handleInterestChange(index, e.target.value)}
                      />
                      {interests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInterest(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addInterest}
                    className="bg-[#152da5] text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    + Add Interest
                  </button>
                </LabelInputContainer>

                {/* Experience Dropdown */}
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="experience">Experience</Label>
                  <select
                    id="experience"
                    name="experience"
                    className="w-full p-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-black dark:text-white"
                  >
                    <option value="">Select your experience level</option>
                    <option value="Beginner">0-2 Years</option>
                    <option value="Intermediate">2-4 Years</option>
                    <option value="Advanced">4-6 Years</option>
                    <option value="Expert">6+ Years</option>
                  </select>
                </LabelInputContainer>

                {/* Education */}
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    name="education"
                    placeholder="Describe your education"
                    type="text"
                  />
                </LabelInputContainer>

                {/* Time Dropdown (Months) */}
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="time">Time Available</Label>
                  <select
                    id="time"
                    name="time"
                    className="w-full p-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-black dark:text-white"
                  >
                    <option value="">Select time availability</option>
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </LabelInputContainer>

                {/* Certificates */}
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="certificates">Certificates</Label>
                  {certificates.map((certificate, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        id={`certificate-${index}`}
                        name={`certificate-${index}`}
                        placeholder="Enter a certificate"
                        type="text"
                        value={certificate}
                        onChange={(e) => handleCertificateChange(index, e.target.value)}
                      />
                      {certificates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCertificate(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCertificate}
                    className="bg-[#152da5] text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    + Add Certificate
                  </button>
                </LabelInputContainer>

                {/* Career Path */}
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="careerPath">Career Path</Label>
                  <Input
                    id="careerPath"
                    name="careerPath"
                    placeholder="Describe your career path"
                    type="text"
                  />
                </LabelInputContainer>

               

                <button
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  type="submit"
                >
                  
                  {loading ? "Loading..." : "Submit"} &rarr;
                  <BottomGradient />
                </button>
              </form>
            </>
          ) : (
            <div className="result-container">
              {/* Result display logic here */}
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default MedicalForm;

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};