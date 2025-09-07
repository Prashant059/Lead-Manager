import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import FollowUps from "./pages/FollowUps";

export default function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/followups" element={<FollowUps />} />
      </Routes>
    </Layout>
  );
}
