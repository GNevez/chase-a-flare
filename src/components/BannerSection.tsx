"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const imageZoomVariants: any = {
  hidden: { opacity: 0.8, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const textFadeVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
      delay: 0.5,
    },
  },
};

export const BannerSection: React.FC = () => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-800 to-black">
          <div className="absolute inset-0">
            <motion.img
              src="https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Óculos de qualidade premium"
              className="w-full h-full object-cover opacity-30"
              variants={imageZoomVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            />
          </div>

          <motion.div
            className="relative z-10 px-8 py-16 md:px-16 md:py-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={textFadeVariants} // Aplicando a variante de fade para o texto
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Proteção e<span className="text-yellow-400"> Estilo</span>
              </h2>

              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Descubra nossa coleção premium de óculos com tecnologia anti luz
                azul. Proteja seus olhos sem abrir mão do design moderno.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  Ver Coleção Completa
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>

                <button className="border-2 border-white text-white hover:bg-white hover:text-gray-800 font-bold py-4 px-8 rounded-xl transition-all duration-300">
                  Saiba Mais
                </button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    100k+
                  </div>
                  <div className="text-gray-300 text-sm">
                    Clientes Satisfeitos
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    5★
                  </div>
                  <div className="text-gray-300 text-sm">Avaliação Média</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    24h
                  </div>
                  <div className="text-gray-300 text-sm">Entrega Rápida</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
