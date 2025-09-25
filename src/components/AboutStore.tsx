"use client";
import { ShieldCheck, Truck, Headphones, Award } from "lucide-react";

const AboutStore = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Quality Guaranteed",
      description:
        "All our eyeglasses come with a 1-year warranty and quality guarantee",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description:
        "Free shipping on all orders over $99. Fast delivery nationwide",
    },
    {
      icon: Headphones,
      title: "Expert Support",
      description:
        "24/7 customer support from licensed opticians and eye care professionals",
    },
    {
      icon: Award,
      title: "Trusted Brand",
      description:
        "Over 15 years serving customers with premium eyewear solutions",
    },
  ];

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Why Choose <span className="text-yellow">VisionStore</span>?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            We're more than just an eyewear retailer. We're your trusted partner
            in vision care, offering premium products and exceptional service to
            help you see the world clearly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center space-y-4 group">
                <div className="mx-auto w-16 h-16 bg-yellow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-8 w-8 text-yellow-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-yellow">
                    {feature.title}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-primary-light rounded-lg p-8 max-w-4xl mx-auto border border-yellow/20">
            <h3 className="text-2xl font-bold mb-4 text-yellow">
              Visit Our Store
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Experience our complete collection in person. Get professional eye
              exams, frame fittings, and personalized recommendations from our
              expert team.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow rounded-full"></div>
                <span>1234 Vision Avenue, NYC 10001</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow rounded-full"></div>
                <span>Mon-Sat: 9AM-7PM, Sun: 11AM-5PM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow rounded-full"></div>
                <span>(555) 123-EYES</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStore;
