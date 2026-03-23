import React from "react";
import Navbar from "./components/Navbar";
import AboutMe from "./components/AboutMe";
import Footer from "./components/Footer";
import ContactPage from "./components/ContactPage";
import Services from "./components/Services";
import Hero from "./components/Hero";
import TechBackground from "./components/TechBackground";
import "./App.css";

function App() {
  return (
    <>
      <TechBackground />

      <div className="App-content">
        <Navbar />
        <Hero />
        <Services />
        <AboutMe />
        <ContactPage />
        <Footer />
      </div>
    </>
  );
}

export default App;