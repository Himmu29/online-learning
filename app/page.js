"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleRedirect = async () => {
    setLoading(true);
    router.push("/workspace");
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-gray-800 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full">
      </div>

      {/* Floating blobs */}
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute right-20 top-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Main content */}
      <motion.div 
        className="flex flex-col items-center justify-center flex-grow px-4 text-center z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-6">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4">
            <span className="mr-2">✨</span> AI-Powered Course Creation
          </div>
        </motion.div>

        <motion.h1 
          variants={item}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          Transform Your Teaching
        </motion.h1>

        <motion.p 
          variants={item}
          className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
        >
          Instantly generate <span className="font-semibold text-indigo-600">custom course layouts</span> powered by AI. 
          Perfect for educators, trainers, and content creators who want to save time while delivering exceptional learning experiences.
        </motion.p>

        <motion.div variants={item}>
          <Button
            className={`px-8 py-4 text-lg rounded-xl transition-all duration-300 transform ${
              isHovered ? "scale-105 shadow-xl" : "scale-100"
            }`}
            onClick={handleRedirect}
            disabled={loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Preparing your workspace...
              </span>
            ) : (
              <span className="flex items-center">
                Get Started 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            )}
          </Button>
        </motion.div>

        <motion.div 
          variants={item}
          className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "⚡", title: "Instant Generation", desc: "Create courses in seconds, not hours" },
              { icon: "🎯", title: "Personalized", desc: "Tailored to your specific audience" },
              { icon: "📈", title: "Optimized", desc: "AI-optimized learning paths" }
            ].map((feature, i) => (
              <div key={i} className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        className="text-center py-6 text-sm text-gray-500 border-t border-gray-100 backdrop-blur-sm z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <p>Built by <span className="font-medium text-indigo-600">Himmu</span> with ❤️ and cutting-edge AI</p>
          <p className="mt-1 text-xs">© {new Date().getFullYear()} AI Course Generation Platform. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
}