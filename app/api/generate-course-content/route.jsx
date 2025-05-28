import { NextResponse } from "next/server";
import { ai } from "../generate-course-layout/route";
import axios from "axios";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";

const PROMPT = `Generate educational content for the given chapter and topics. 

IMPORTANT: Respond with ONLY valid JSON, no additional text or formatting.

Required JSON Schema:
{
  "chapterName": "string",
  "topics": [
    {
      "topic": "string", 
      "content": "HTML content as string - escape all quotes properly"
    }
  ]
}

Rules:
1. All HTML content must be properly escaped for JSON
2. Use single quotes in HTML attributes or escape double quotes
3. No markdown code blocks in response
4. No additional text outside the JSON object

Chapter and Topics:`

export async function POST(req) {
    try {
        // Fix 1: req.json() returns an object, not an array - destructure properly
        const requestBody = await req.json();
        const { courseJson, courseTitle, courseId } = requestBody;
        
        // Add validation
        if (!courseJson?.chapters) {
            return NextResponse.json(
                { error: "Invalid request: courseJson.chapters is required" },
                { status: 400 }
            );
        }

        const promises = courseJson.chapters.map(async (chapter) => {
            try {
                const config = {
                    responseMimeType: 'text/plain',
                };
                const model = 'gemini-2.0-flash';
                const contents = [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: PROMPT + JSON.stringify(chapter),
                            },
                        ],
                    },
                ];

                const response = await ai.models.generateContent({
                    model,
                    config,
                    contents,
                });
                
                const rawText = response.candidates[0].content.parts[0].text;
                // console.log('Raw AI Response:', rawText);
                
                // Better JSON extraction and parsing
                let cleanedJson = rawText;
                
                // Remove markdown code blocks
                cleanedJson = cleanedJson.replace(/```json\s*/g, '').replace(/```\s*/g, '');
                
                // Remove any leading/trailing whitespace
                cleanedJson = cleanedJson.trim();
                
                // Try to find JSON content if wrapped in other text
                const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    cleanedJson = jsonMatch[0];
                }
                
                console.log('Cleaned JSON:', cleanedJson.substring(0, 500) + '...');
                
                let JSONResp;
                try {
                    JSONResp = JSON.parse(cleanedJson);
                } catch (parseError) {
                    console.error('JSON Parse Error:', parseError);
                    console.error('Problematic JSON:', cleanedJson);
                    
                    // Return a fallback response instead of crashing
                    JSONResp = {
                        chapterName: chapter.chapterName || 'Unknown Chapter',
                        error: 'Failed to parse AI response',
                        rawResponse: rawText.substring(0, 1000) // Truncate for logging
                    };
                }

                // get yt video as well
                const youtubeData = await GetYoutubeVideo(chapter?.chapterName);
                console.log({
                    youtubeVideo:youtubeData,
                    courseData:JSONResp
                })
                return {
                    youtubeVideo:youtubeData,
                    courseData:JSONResp
                }

            } catch (chapterError) {
                console.error('Error processing chapter:', chapter, chapterError);
                return { 
                    error: `Failed to process chapter: ${chapter.name || 'Unknown'}`,
                    chapter: chapter.name || 'Unknown'
                };
            }
        });

        const CourseContent = await Promise.all(promises);

        // Filter out any failed chapters
        const successfulContent = CourseContent.filter(content => !content.error);
        const failedChapters = CourseContent.filter(content => content.error);

        if (failedChapters.length > 0) {
            console.log('Failed to process chapters:', failedChapters);
        }

        // save to database
        const dbResp = await db.update(coursesTable).set({
            courseContent:CourseContent
        }).where(eq(coursesTable.cid,courseId));

        return NextResponse.json({
            courseName: courseTitle,
            CourseContent: successfulContent,
            failedChapters: failedChapters.length > 0 ? failedChapters : undefined
        });
        
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search'

const GetYoutubeVideo = async(topic)=>{
    const params={
        part:'snippet',
        q:topic,
        maxResult:4,
        type:'video',
        key: process.env.YOUTUBE_API_KEY
    }
    const resp = await axios.get(YOUTUBE_BASE_URL,{params});
    const youtubeVideoListResp=resp.data.items;
    const youtubeVideoList = [];
    youtubeVideoListResp.forEach(item=>{
        const data = {
            videoId:item?.id?.videoId,
            title:item?.snippet?.title
        }
        youtubeVideoList.push(data);
    })
    console.log("youtubeVideoList",youtubeVideoList);
    return youtubeVideoList;
}