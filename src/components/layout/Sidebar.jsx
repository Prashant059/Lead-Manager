import { NavLink } from "react-router-dom";
import { Home, Users, CalendarCheck } from "lucide-react";

export default function Sidebar(){
  const Nav = ({to, children}) => (
    <NavLink
      to={to}
      className={({isActive}) => `flex items-center gap-3 px-4 py-2 rounded-md ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      {children}
    </NavLink>
  );

  return (
    <aside className="w-64 bg-white border-r p-5 flex flex-col">
      <div className="mb-8">
        <h1 className="text-indigo-600 font-bold text-xl">Lead Management</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        <Nav to="/"><Home size={18}/>Dashboard</Nav>
        <Nav to="/leads"><Users size={18}/>Leads</Nav>
        <Nav to="/followups"><CalendarCheck size={18}/>Follow Ups</Nav>
      </nav>
      <div className="mt-6 text-sm text-gray-500">
        © {new Date().getFullYear()}
      </div>
    </aside>
  );
}
