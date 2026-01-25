import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import SiteTitle from './components/SiteTitle/SiteTitle';

// Importing pages
import Index from './pages/Index/Index';
import Catalog from './pages/Catalog/Catalog';
import Favourites from './pages/Favourites/Favourites';
import Graphs from './pages/Graphs/Graphs';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';


function App() {
  return (
    <>
      <Router>
          <SiteTitle />
          <Routes>
            <Route path='/' element={<Index/>}/>
            {/* <Route path='/home' element={<Home/>}/> */}
            <Route path='/catalog' element={<Catalog/>}/>
            <Route path='/favourites' element={<Favourites/>}/>
            <Route path='/graphs' element={<Graphs/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
          </Routes>
      </Router>
    </>
  )
}

export default App