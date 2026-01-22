"use client";

import { useRef } from "react";
import Link from "next/link";
import { FiChevronRight, FiCheckCircle } from "react-icons/fi";
import AbstractGraphic from "../Mockups/AbstractGraphics";

export default function FeatureCard({ item }) {
  return (
    <div className="group relative flex h-[500px] flex-col justify-between overflow-hidden bg-[#111111] p-8 transition-all duration-300 hover:bg-[#161616] border-b-2 border-transparent hover:border-[#E39A2E]">
      
      {/* 1. TOP CONTENT */}
      <div className="relative z-10">
        <h3 className="text-[23px] font-medium text-white mb-6">
          {item.title}
        </h3>
        
        <p className="text-sm leading-relaxed text-gray-400 mb-6">
          {item.details}
        </p>

        {/* Optional Check Icon like in reference */}
         <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
             <FiCheckCircle className="text-[#E39A2E] text-xl" />
         </div>
      </div>

      {/* 2. MIDDLE - 3D ANIMATION AREA */}
      {/* This mimics the graphics in the center/bottom of the reference cards */}
      <div className="absolute inset-0 top-40 z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
        <AbstractGraphic type={item.graphicType} />
      </div>

      {/* 3. BOTTOM LINK */}
      {/* <div className="relative z-10 mt-auto pt-6">
        <Link 
            href="#" 
            className="inline-flex items-center text-xs font-bold tracking-widest text-white uppercase hover:text-[#E39A2E] transition-colors"
        >
            Read More 
            <FiChevronRight className="ml-1 text-[#E39A2E]" />
        </Link>
      </div> */}

    </div>
  );
}