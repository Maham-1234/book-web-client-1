import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/PageComponents/Navbar";
import Footer from "./components/PageComponents/Footer";

function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default App;
