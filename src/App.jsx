import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "@/pages/not-found";
import Booking from "@/pages/booking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Booking />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
