
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
