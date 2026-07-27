import Image from "next/image";
import { Glasses, Sparkles } from "lucide-react";
import ovalImg from "@/assets/rosto/oval.png";
import quadradoImg from "@/assets/rosto/quadrado.png";
import redondoImg from "@/assets/rosto/redondo.png";
import triangularImg from "@/assets/rosto/triangular.png";
import Link from "next/link";

export const metadata = {
  title: "Guia de Formato de Rosto | Chase a Flare",
  description: "Descubra qual formato de óculos combina perfeitamente com o seu tipo de rosto.",
};

const faceShapes = [
  {
    id: "oval",
    title: "Rosto Oval",
    image: ovalImg,
    characteristics: [
      "Testa ligeiramente mais larga que o queixo",
      "Maçãs do rosto proeminentes",
      "Queixo arredondado",
      "Proporções equilibradas"
    ],
    bestGlasses: [
      "Armações quadradas ou retangulares",
      "Aviadores clássicos",
      "Óculos geométricos",
      "Cat-eye para um look vintage"
    ],
    tip: "Você tem sorte! O rosto oval é considerado o mais versátil. Praticamente qualquer estilo de óculos fica bem, mas modelos quadrados e geométricos criam um contraste interessante com suas curvas naturais.",
    color: "bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20"
  },
  {
    id: "redondo",
    title: "Rosto Redondo",
    image: redondoImg,
    characteristics: [
      "Largura e comprimento similares",
      "Bochechas cheias",
      "Queixo suave e arredondado",
      "Linhas curvas dominantes"
    ],
    bestGlasses: [
      "Armações angulares e retangulares",
      "Óculos quadrados",
      "Modelos com ponte baixa",
      "Hastes decoradas nas laterais"
    ],
    tip: "Busque adicionar definição! Armações angulares e retangulares ajudam a alongar visualmente o rosto, criando equilíbrio. Evite óculos muito redondos ou pequenos.",
    color: "bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20"
  },
  {
    id: "quadrado",
    title: "Rosto Quadrado",
    image: quadradoImg,
    characteristics: [
      "Testa, maçãs do rosto e maxilar com largura similar",
      "Mandíbula angular e pronunciada",
      "Linhas retas e definidas",
      "Aparência forte e marcante"
    ],
    bestGlasses: [
      "Armações redondas ou ovais",
      "Modelos aviador",
      "Óculos com cantos arredondados",
      "Cat-eye suave"
    ],
    tip: "Suavize os ângulos! Armações redondas ou ovais equilibram as linhas fortes do seu rosto. Busque modelos que adicionem curvas e evite armações muito quadradas ou angulares.",
    color: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20"
  },
  {
    id: "triangular",
    title: "Rosto Triangular (Coração)",
    image: triangularImg,
    characteristics: [
      "Testa mais larga",
      "Maçãs do rosto proeminentes",
      "Queixo estreito e pontudo",
      "Base menor que o topo"
    ],
    bestGlasses: [
      "Armações bottom-heavy (base mais larga)",
      "Aviadores",
      "Óculos sem aro ou com aro inferior",
      "Modelos com detalhes na parte inferior"
    ],
    tip: "Equilibre as proporções! Escolha armações que sejam mais largas na parte inferior, ajudando a balancear a testa mais ampla. Cat-eye invertido e aviadores funcionam perfeitamente.",
    color: "bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-500/20"
  }
];

export default function GuiaDeRostoPage() {
  return (
    <div className="min-h-screen bg-white pt-18">
      {/* Hero Section */}
      <section className="border-b bg-white pt-32 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Guia de Formato de Rosto
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Descubra qual formato de armação valoriza mais o seu rosto. 
              Cada formato tem características únicas que combinam melhor com diferentes estilos.
            </p>
          </div>
        </div>
      </section>

      {/* Face Shapes Grid */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:gap-24">
            {faceShapes.map((shape, index) => (
              <div key={shape.id} className="border-b pb-16 last:border-b-0 last:pb-0">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                  {/* Image - alterna lado baseado no index */}
                  <div className={`relative ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative mx-auto aspect-square max-w-sm overflow-hidden rounded-2xl bg-gray-50 p-8">
                      <Image
                        src={shape.image}
                        alt={shape.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}>
                    <div className="mb-8">
                      <h3 className="mb-3 text-3xl font-bold text-gray-900 lg:text-4xl">
                        {shape.title}
                      </h3>
                    </div>

                    {/* Características */}
                    <div className="mb-8">
                      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Características
                      </h4>
                      <ul className="space-y-3">
                        {shape.characteristics.map((char, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-700">
                            <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                            <span>{char}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Melhores Óculos */}
                    <div className="mb-8">
                      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Óculos Recomendados
                      </h4>
                      <ul className="space-y-3">
                        {shape.bestGlasses.map((glass, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-700">
                            <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                            <span className="font-medium">{glass}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Dica */}
                    <div className="rounded-lg bg-gray-50 p-5 border-l-4 border-accent">
                      <p className="text-sm leading-relaxed text-gray-700">
                        {shape.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gray-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Pronto para encontrar seu par perfeito?
            </h2>
            
            <p className="mb-8 text-lg text-gray-600">
              Explore nossa coleção e encontre o óculos ideal que valoriza seu estilo único
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-white transition-all hover:bg-primary/90"
              >
                <Glasses className="h-5 w-5" />
                <span>Ver Produtos</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
