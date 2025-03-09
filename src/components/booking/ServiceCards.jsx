import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    id: "regular",
    title: "Regular Cleaning",
    image: "/images/regular-cleaning.jpg",
  },
  {
    id: "deep",
    title: "Deep Cleaning",
    image: "/images/deep-cleaning.jpg",
  },
  {
    id: "move",
    title: "Move In/Out",
    image: "/images/move-in-out.jpg",
  },
  {
    id: "airbnb",
    title: "AirBnB",
    image: "/images/airBnb.jpg",
  },
];

export default function ServiceCards({ onServiceSelect }) {
  return (
    <div className="flex items-center justify-center md:mt-24 mt-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-900">Select Service</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 md:mx-24">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onServiceSelect(service.id)}
            >
              <Card className="cursor-pointer hover:border-primary hover:text-primary transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-md font-bold mb-2">{service.title}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
