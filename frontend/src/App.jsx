import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import HealthReport from './pages/HealthReport'
import TestResults from './pages/TestResults'
import CBCReport from './pages/CBCReport'
import BloodGlucoseReport from './pages/BloodGlucoseReport'
import LipidProfileReport from './pages/LipidProfileReport'
import LiverFunctionReport from './pages/LiverFunctionReport'
import KidneyFunctionReport from './pages/KidneyFunctionReport'
import ThyroidFunctionReport from './pages/ThyroidFunctionReport'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/health-report"
          element={<HealthReport />}
        />

        <Route
          path="/test-results"
          element={<TestResults />}
        />

        <Route
          path="/test-results/cbc"
          element={<CBCReport />}
        />

        <Route
          path="/test-results/blood-glucose"
          element={<BloodGlucoseReport />}
        />

        <Route
          path="/test-results/lipid"
          element={<LipidProfileReport />}
        />

        <Route
          path="/test-results/lft"
          element={<LiverFunctionReport />}
        />

        <Route
          path="/test-results/kidney"
          element={<KidneyFunctionReport />}
        />

        <Route
          path="/test-results/thyroid"
          element={<ThyroidFunctionReport />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App