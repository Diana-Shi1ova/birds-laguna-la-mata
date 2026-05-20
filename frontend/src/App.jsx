import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import SiteTitle from './components/SiteTitle/SiteTitle';

// Importing pages
import Index from './pages/Index/Index';
import Catalog from './pages/Catalog/Catalog';
import Favourites from './pages/Favourites/Favourites';
import Statistics from './pages/Statistics/Statistics';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";


function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  
  return (
    <>
      <Router>
          <SiteTitle />
          <Routes>
            <Route path='/' element={<Index/>}/>
            <Route path='/catalog' element={<Catalog/>}/>
            <Route path='/favourites' element={<Favourites/>}/>
            <Route path='/statistics' element={<Statistics/>}/>
            <Route path='/statistics/bird' element={<Statistics/>}/>
            <Route path='/statistics/bird/:bird' element={<Statistics/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
          </Routes>
      </Router>
    </>
  )
}

export default App