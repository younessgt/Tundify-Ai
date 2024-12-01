"use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

export default function SomeThingWentWrong() {
  return (
    <div className="h-screen flex items-center justify-center py-6 overflow-hidden dark:bg-dark_bg_1">
      {/* Container */}
      <div className="w-full max-w-md p-6 space-y-6 text-center bg-white rounded-lg shadow-md dark:bg-dark_bg_2 dark:text-dark_text_1">
        <h2 className="text-2xl font-bold sm:text-3xl text-[#ff5722]">
          OooP'S
        </h2>
        <p className="text-base">
          Something went wrong. Please try again later.
        </p>
      </div>
    </div>
  );
}
