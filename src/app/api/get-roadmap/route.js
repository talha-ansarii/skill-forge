import Roadmap from "@/models/Roadmap";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    
    const { email } = await request.json();
    try {
      await connect(); // Ensure MongoDB connection is established
        console.log(email)
      const roadmap = await Roadmap.findOne(
        { email: email }
      );
      console.log(roadmap)
  
      return new NextResponse( JSON.stringify({roadmap }) , {
        status: 200,
        
      });
    } catch (error) {
      console.error('Error processing request:', error);
      return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };