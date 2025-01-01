import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from "./pages/Page";
import Home from "./pages/Home";
import Upload from "./pages/Studio";
import Video from "./pages/Video";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>  } />
        <Route path="/studio" element={ <Layout><Upload /></Layout>  } />
        <Route path="/v/:data_id" element={<Layout><Video /></Layout>  } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/*" element={<Lost.jsx />} />    ERROR 404 to be made    */}
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
}
