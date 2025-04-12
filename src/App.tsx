
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import ResumeDashboard from './pages/ResumeDashboard'
import ResumeEditor from './pages/ResumeEditor'
import { Toaster } from "@/components/ui/toaster"
import React from 'react'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/resumes" element={<ResumeDashboard />} />
        <Route path="/resumes/edit/:id" element={<ResumeEditor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
