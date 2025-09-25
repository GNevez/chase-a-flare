"use client";
import React from "react";
import newCollectionImage from "@/assets/banner2.jpg";
import Image from "next/image";

function NewCollection() {
  return (
    // 1200 x 440 res boa
    <div>
      <Image src={newCollectionImage} className="w-full" alt="New Collection" />
    </div>
  );
}

export default NewCollection;
