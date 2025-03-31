import { AdvancedFlipCard } from '@/components/ui/advanced-flip-card';
import Layout from '@/components/layout/Layout';

export default function CardDemoPage() {
  const serviceExamples = [
    {
      title: "Express Detail",
      subtitle: "Quick & Effective",
      price: "$125-175",
      originalPrice: "$160-$220",
      discount: "20% OFF",
      duration: "2 Hour Job",
      description: [
        "Interior vacuum",
        "Exterior pressure wash",
        "Microfiber towel dry with wax"
      ]
    },
    {
      title: "Interior Deep Clean",
      subtitle: "Thorough Inside Care",
      price: "$150-350",
      originalPrice: "$190-$440",
      discount: "20% OFF",
      duration: "2-4 Hour Job",
      description: [
        "Deep vacuuming",
        "Carpet or leather conditioning",
        "Spot stain removal"
      ]
    },
    {
      title: "Exterior Wash & Wax",
      subtitle: "Brilliant Shine",
      price: "$200-400",
      originalPrice: "$250-$500",
      discount: "20% OFF",
      duration: "2-4 Hour Job",
      description: [
        "Ceramic Wax application",
        "Paint decontamination",
        "Pre-contact wash foam"
      ]
    }
  ];

  return (
    <Layout>
      <div className="bg-cream py-16">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-10">
            Our New Service Cards
          </h1>
          
          <div className="flex flex-wrap justify-center gap-10 mb-16">
            {serviceExamples.map((service, index) => (
              <AdvancedFlipCard
                key={index}
                title={service.title}
                subtitle={service.subtitle}
                price={service.price}
                originalPrice={service.originalPrice}
                discount={service.discount}
                duration={service.duration}
                description={service.description}
                onClickBook={() => alert(`Booking ${service.title}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}