import { Outlet } from "react-router-dom";
//import { Navbar } from './Navbar'; // Create this component
//import { Footer } from './Footer'; // Create this component

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <main className="flex-grow">
        <Outlet />{" "}
        {/* This is where the routed page component will be rendered */}
      </main>
      {/* <Footer /> */}
    </div>
  );
}
