"use client"; 

import { motion } from "framer-motion";

const infoData = [
  {
    title: "+120.000",
    subtitle: "Nossas vendas",
  },
  {
    title: "Troca Fácil",
    subtitle: "Até 7 dias para trocar",
  },
  {
    title: "Frete Grátis",
    subtitle: "Em todo o Brasil",
  },
  {
    title: "Até 3x s/ juros",
    subtitle: "No cartão de crédito",
  },
];

const cardContainerVariants: any = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const titleVariants: any = {
  hidden: {
    opacity: 0,
    color: "#a1a1aa", 
  },
  visible: {
    opacity: 1,
    color: "#ffffff", 
    transition: {
      duration: 1,
      ease: "easeOut",
      delay: 0.4, 
    },
  },
};

interface InfoCardProps {
  title: string;
  subtitle: string;
  index: number;
}

const InfoCard = ({ title, subtitle, index }: InfoCardProps) => (
  <motion.div
    className="flex flex-col items-center justify-center text-center"
    custom={index}
    variants={cardContainerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
  >
    <motion.h3
      className="text-5xl text-accen sm:text-6xl md:text-7xl font-extralight tracking-tight"
      variants={titleVariants} 
    >
      {title}
    </motion.h3>
    <p className="mt-3 text-sm text-gray-400 uppercase tracking-wider">
      {subtitle}
    </p>
  </motion.div>
);

export default function InfoSection() {
  return (
    <section className="py-24 md:py-32 from-gray-100 to-primary relative overflow-hidden bg-linear-to-b">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-12 sm:gap-8">
          {infoData.map((item, index) => (
            <InfoCard
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
