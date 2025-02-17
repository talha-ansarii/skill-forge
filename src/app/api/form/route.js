import { NextResponse } from 'next/server';
import connect from '@/utils/db';
import Form from '@/models/Form';
import Roadmap from '@/models/Roadmap';
import { Client } from "@gradio/client";

export const POST = async (request) => {
  try {
    const client = await Client.connect("https://58d8a265d0c204a1b2.gradio.live/");

    await connect(); // Ensure MongoDB connection is established

    


    const formData = await request.formData();
    const entries = Array.from(formData.entries());

    const skills = entries.find((entry) => entry[0] === 'skills')[1];
    const interests = entries.find((entry) => entry[0] === 'interests')[1];
    const certificates = entries.find((entry) => entry[0] === 'certificates')[1];
    const experience = entries.find((entry) => entry[0] === 'experience')[1];
    const education = entries.find((entry) => entry[0] === 'education')[1];
    const time = entries.find((entry) => entry[0] === 'time')[1];
    const careerPath = entries.find((entry) => entry[0] === 'careerPath')[1];
    const email = entries.find((entry) => entry[0] === 'email')[1];

    // Parse JSON arrays if needed
    const skillsArray = JSON.parse(skills);
    const interestsArray = JSON.parse(interests);
    const certificatesArray = JSON.parse(certificates);

    // Validate form data
    if (
      !skillsArray.length ||
      !interestsArray.length ||
      !certificatesArray.length ||
      !experience ||
      !education ||
      !time ||
      !careerPath
    ) {
      return new NextResponse(JSON.stringify({ message: 'Please fill all fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // Convert arrays to comma-separated strings
const skillsString = skillsArray.join(', ');
const interestsString = interestsArray.join(', ');
const certificatesString = certificatesArray.join(', ');

    const result = await client.predict("/predict", { 		
      skills: skillsString, 		
      interests: interestsString, 		
      experience:experience, 		
      education: education, 		
      time: time, 		
      certificates: certificatesString, 		
      careerpath: careerPath, 
  });

  console.log("result", result);

   // Extract the data you want to save
   const roadmapData = result.data[0];
   console.log(email)
   const roadmapdatawithemail = { ...roadmapData, email }; 
   console.log(roadmapdatawithemail)
   
 try{
  const roadmapDoc = new Roadmap(roadmapdatawithemail);
 
  // Save the roadmap data to MongoDB
  await roadmapDoc.save();

  console.log(roadmapDoc)

 }catch(err){
  console.log(err)
 }



    // Save form data to MongoDB
    const formDoc = new Form({
      skills: skillsArray,
      interests: interestsArray,
      certificates: certificatesArray,
      experience,
      education,
      time,
      careerPath,
      email,
    });

    await formDoc.save();

    return new NextResponse(JSON.stringify({ message: 'Form submitted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};



   