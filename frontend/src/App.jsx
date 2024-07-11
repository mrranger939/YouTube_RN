import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "./pages/Home";
import Upload from "./pages/Studio";
import Video from "./pages/Video";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studio" element={<Upload />} />
        <Route path="/:data_id" element={<Video />} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
}
