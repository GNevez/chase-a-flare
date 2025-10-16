// components/FeatureSection.tsx
import React from 'react';

const FeatureSection: React.FC = () => {
  const images = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCrnEQus4CPJIDSStCjIBb-RJ8R3FrGGJTNegp97his9na-sTDRr3gzaZmZSWy1_2QIHMPYuaSSbfU0fNgBnCxHR_GKKoKu6rs-N6cUBXmtpyCpBayQ230AurS2VvFHnQwLC5YC5R5eIIOfHIOcqAA9TwylGZ056ox0dxy3JIEMfMNeCx3iKaccMj0iDmV_PSzYEXhEgSg_w8qSSjYnOG9Kbk9Jvk2ViDahtWuJgucOpTHpnhnMXbKyTczSmWdjoPVdAprV9AeWea8',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCrnEQus4CPJIDSStCjIBb-RJ8R3FrGGJTNegp97his9na-sTDRr3gzaZmZSWy1_2QIHMPYuaSSbfU0fNgBnCxHR_GKKoKu6rs-N6cUBXmtpyCpBayQ230AurS2VvFHnQwLC5YC5R5eIIOfHIOcqAA9TwylGZ056ox0dxy3JIEMfMNeCx3iKaccMj0iDmV_PSzYEXhEgSg_w8qSSjYnOG9Kbk9Jvk2ViDahtWuJgucOpTHpnhnMXbKyTczSmWdjoPVdAprV9AeWea8', // Imagens repetidas conforme o HTML original
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDNR1YiAUVWUti8d5flb_S9FUj2p-X7VtbzTo7OpmtuBn8D5UYmQ1lRxQbhse931ji2_bYFYvPyaCNHhdBGEBHQPzclsxLL4g1c7bHSoe2j3xgZcSmffSCUozrjJbWHhn21JQwJNieVqLkQrl2m82cNpcqOEKu3IOR3LYxHtkbdKFm4CdzUcI1UGPsRBCU1vrjmc7A5geEBO9zJXxWGKTezys_ckrzT3FJm_WbC-wrsOdlNmCWcYaldaaFkiJjTcz8EKZuyIoN6vJg',
  ];

  return (
    <div className="mt-8 lg:mt-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary dark:text-background-light">Chase A Flare</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((src, index) => (
          // CLASSE ALTERADA AQUI: de 'aspect-video' para 'aspect-[9/16]'
          <div key={index} className="relative group aspect-[9/16]"> 
            <div 
              className="absolute inset-0 bg-primary/10 rounded-xl bg-cover bg-center" 
              style={{ backgroundImage: `url('${src}')` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;