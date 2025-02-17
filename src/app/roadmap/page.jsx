"use client"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"






const CourseCard = ({ course }) => (
  <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-xl font-semibold mb-2 text-blue-400">{course.name}</h3>
    <p className="text-gray-300 mb-4">{course.description}</p>
    <Link
      href={course.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
    >
      Learn More <ExternalLink className="ml-2 h-4 w-4" />
    </Link>
  </div>
)

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState([])





  const fetchRoadmap = async () => {
    const session = await fetch("/api/auth/session")
      const dataa = await session.json()
      console.log(dataa.user.email)
      const email = await dataa.user.email



    const response = await fetch("/api/get-roadmap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email
      })
    })

    console.log(response)
    const data = await response.json()

    console.log(data)
    const road = data.roadmap
    const roadFinal = {
      beginner: road.beginner,
      intermediate: road.intermediate,
      advanced: road.advanced
    }
    setRoadmap(roadFinal)
  }


let email;
  useEffect(() => {
   
    fetchRoadmap()
  }, [])



  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-12 text-center">Learning Roadmap</h1>
      <div className="space-y-16">
      {!roadmap && <p className="text-gray-400">
        <Link
                id="animated-auth-btn"
                href="/form"
                className="bg-white mt-3 text-black tracking-normal font-sans font-semibold px-3 py-2 rounded-lg hover:bg-black hover:text-white transition-colors duration-300"
              >
               Fill form to Get Started
              </Link>
      </p>
      }
        {roadmap && 
        Object.entries(roadmap).map(([level, courses]) => (
          <div key={level} className="space-y-6">
            <h2 className="text-3xl font-semibold mb-6 capitalize text-gray-300">{level}</h2>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <CourseCard key={index} course={course} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No courses available at this level yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Roadmap

