import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage.jsx";

export default function App() {
  return (
    <div className="app-background min-h-screen">
      <HomePage />
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        toastClassName="light-toast"
        bodyClassName="light-toast-body"
      />
    </div>
  );
}

