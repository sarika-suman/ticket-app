import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import TicketsPage from './TicketsPage';
import logo from './assets/logo.png';
import preview from './assets/preview.png';
import step1 from './assets/step1.png';
import step2 from './assets/step2.png';
import step3 from './assets/step3.png';
import hero from './assets/hero.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { SignIn, SignUp, SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

// Sign In Page
function SignInPage() {
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Sign In to ResolveRight</h2>
        <SignIn redirectUrl="/" />
      </div>
    </div>
  );
}

// Sign Up Page
function SignUpPage() {
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Sign Up for ResolveRight</h2>
        <SignUp redirectUrl="/" />
      </div>
    </div>
  );
}

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <Navigate to="/sign-in" />;
  return children;
}

// Shared Header Component
function Header() {
  const { isSignedIn } = useUser();
  
  return (
    <header className="header-strip">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo + Brand Title */}
        <div className="d-flex align-items-center">
          <img src={logo} alt="Logo" className="logo" />
          <Link to="/" className="text-decoration-none">
            <h1 className="brand-title mb-0 text-dark">ResolveRight</h1>
          </Link>
        </div>

        {/* Menu + Auth Button */}
        <div className="d-flex align-items-center gap-4">
          <nav className="menu-box d-flex align-items-center">
            <Link to="/" className="menu-link">Home</Link>
            <a href="#about" className="menu-link">About</a>
            <Link to="/tickets" className="menu-link">Tickets</Link>
            <a href="#more" className="menu-link">More</a>
            <a href="#contact" className="menu-link">Contact Us</a>
          </nav>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in">
              <button className="login-btn">Login/Signup <i className="bi bi-box-arrow-in-right me-2"></i></button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

// Home Page
function HomePage() {
  return (
    <>
      {/* Split Section */}
      <section className="split-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex flex-column justify-content-center">
              <div className="content-block mt-5">
                <h1 className="left-split-heading mb-3">ResolveRight: Right Solutions, Right Now</h1>
                <p className="left-split-paragraph mb-4">
                  ResolveRight is an AI-powered support automation platform that transforms customer service operations through intelligent issue classification, precision routing, and resolution-first workflows.
                </p>
                <div className="d-flex justify-content-center gap-4 ps-5">
                  <button className="btn btn-primary">Get Started</button>
                  <Link to="/tickets" className="btn btn-outline-secondary">View Tickets</Link>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="image-container">
                <img src={preview} alt="Analytics" className="img-fluid rounded-3" />
                <p className="image-caption text-muted mt-2 text-center">
                  From request to resolution — lightning fast
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold mb-4 text-start" style={{ fontSize: "3rem", color: "#007BFF" }}>
            How ResolveRight Works
          </h2>
          <div className="row mb-5 gx-4">
            {[{ src: step1, title: "Step 1: Auto-Classification" },
              { src: step2, title: "Step 2: Precision Routing" },
              { src: step3, title: "Step 3: Fast Resolution" }].map((step, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="p-3 border rounded bg-white shadow-sm h-100 d-flex flex-column align-items-center text-center">
                  <img src={step.src} alt={step.title} className="img-fluid rounded mb-3" style={{ maxHeight: '220px', objectFit: 'cover' }} />
                  <p className="fw-semibold fs-5">{step.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="row align-items-center">
            <div className="col-md-8">
              <p className="mb-0 text-start">
                ResolveRight uses AI to analyze and auto-assign tickets from multiple channels. Watch the demo to see how easily your support workflow gets optimized.
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button className="btn btn-primary btn-lg">Watch Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <header className="hero-section py-5">
        <div className="container text-center">
          <h1 className="display-4">Where precision meets customer care</h1>
          <p className="lead mt-3">
            Exclusively designed for support teams, our AI-powered system analyzes incoming requests across email, WhatsApp, and multiple channels, accurately categorizing issues, and routing them to optimally skilled agents in real-time.
          </p>
          <div className="mt-4">
            <img src={hero} alt="Hero" className="img-fluid rounded" />
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Quantifying Operational Excellence</h2>
          <div className="row text-center">
            {[{
              icon: "bi-bar-chart-fill", color: "text-primary", stat: "99.1%", desc: "Classification Accuracy"
            }, {
              icon: "bi-stopwatch-fill", color: "text-success", stat: "800ms", desc: "Average Assignment Time"
            }, {
              icon: "bi-emoji-smile-fill", color: "text-warning", stat: "89%", desc: "Higher Satisfaction"
            }, {
              icon: "bi-graph-up-arrow", color: "text-danger", stat: "450K", desc: "Weekly Updates"
            }].map((item, index) => (
              <div className="col-md-3 mb-4" key={index}>
                <div className="p-4 border rounded bg-white shadow-sm h-100">
                  <i className={`bi ${item.icon} display-6 ${item.color} mb-2`}></i>
                  <h3>{item.stat}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light py-5">
        <div className="container">
          {/* ... footer content stays unchanged ... */}
          {/* You can keep your footer content the same here */}
        </div>
      </footer>
    </>
  );
}

// Main App
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route 
          path="/tickets" 
          element={
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
