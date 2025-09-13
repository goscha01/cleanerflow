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
    <div className="flex items-center justify-center md:mt-18 mt-6">
      <div className="text-center">
        {/* <div className="top-0 fixed p-4 left-1/2 -translate-x-1/2 w-full border-b border-gray-200 bg-white z-10">
          <div className="flex justify-center">
            <img
              src="/logo/LogoUp2.png"
              alt=""
              className="sm:w-[300px] w-[200px]"
            />
          </div>
        </div> */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 md:mx-24">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onServiceSelect(service.id);
              }}
              className="h-full"
            >
              <Card className="cursor-pointer hover:border-primary hover:text-primary transition-colors h-full">
                <CardContent className="p-3 flex flex-col items-center text-center h-full">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-16 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-md font-bold">{service.title}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
