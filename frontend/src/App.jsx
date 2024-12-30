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
        <Route path="/v/:data_id" element={<Video />} />
        {/* <Route path="/*" element={<Lost.jsx />} />    ERROR 404 to be made    */}
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
}
