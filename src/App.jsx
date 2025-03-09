import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "@/pages/not-found";
import Booking from "@/pages/booking";
import Home from "@/pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Booking />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
