import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'

// Importing pages
import Index from './pages/Index/Index';

function App() {
  return (
    <>
      <Router>
          <Routes>
            <Route path='/' element={<Index/>}/>
          </Routes>
      </Router>
    </>
  )
}

export default App
