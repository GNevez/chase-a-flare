"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Categories = () => {
  const categories = [
    {
      id: "eyeglasses",
      name: "Eyeglasses",
      description: "Prescription and reading glasses",
      count: "200+ styles",
      gradient: "from-blue-50 to-indigo-100",
      icon: "👓",
    },
    {
      id: "sunglasses",
      name: "Sunglasses",
      description: "UV protection and style combined",
      count: "150+ styles",
      gradient: "from-amber-50 to-orange-100",
      icon: "🕶️",
    },
    {
      id: "computer",
      name: "Computer Glasses",
      description: "Blue light blocking technology",
      count: "50+ styles",
      gradient: "from-emerald-50 to-green-100",
      icon: "💻",
    },
    {
      id: "designer",
      name: "Designer Frames",
      description: "Luxury brands and exclusive designs",
      count: "100+ styles",
      gradient: "from-purple-50 to-pink-100",
      icon: "✨",
    },
  ];

  return (
    <section className="py-16 bg-professional-light">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Shop by <span className="text-yellow">Category</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect eyewear for every need and style preference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative bg-card rounded-lg border border-professional-border hover:shadow-elevated transition-all duration-300 overflow-hidden cursor-pointer hover:border-yellow/50"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative p-6 space-y-4">
                <div className="text-3xl">{category.icon}</div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-yellow transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                  <p className="text-yellow font-medium text-sm">
                    {category.count}
                  </p>
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-0 h-auto font-medium text-foreground group-hover:text-yellow"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;