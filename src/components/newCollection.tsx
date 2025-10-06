"use client";

import Image from "next/image";
import newCollectionImage from "@/assets/banner2.jpg"; 
import { motion } from "framer-motion";

const imageVariants: any = {
  hidden: { opacity: 0.8, scale: 1.1 }, 
  visible: {
    opacity: 1,
    scale: 1, 
    transition: {
      duration: 0.4, 
      ease: [0.25, 0.46, 0.45, 0.94], 
    },
  },
};

function NewCollection() {
  return (
    <div className="w-full overflow-hidden rounded-lg">
      {" "}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <Image
          src={newCollectionImage}
          className="w-full h-auto object-cover"
          alt="New Collection"
          priority
        />
      </motion.div>
    </div>
  );
}

export default NewCollection;
