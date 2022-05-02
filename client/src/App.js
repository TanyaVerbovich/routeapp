import React from 'react';
import './App.css';
import Header from './components/Header'
import { Routes, Route } from 'react-router'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePageCustomer from './pages/HomePageCustomer';
import Rules from './pages/Rules';
import ProjectCreationPage from './pages/ProjectCreationPage';
import EditTimetable from './pages/EditTimetable';
import CreateDriver from './pages/CreateDriver';
import HomePageAdmin from './pages/HomePageAdmin';
import HomePageDriver from './pages/HomePageDriver';
import MapPage from './pages/MapPage';
import ChooseOption from './pages/ChooseOption';
import NormalCreationPage from './pages/NormalCreationPage';
import GetInfoLeaflet from './pages/GetInfoLeaflet'


function App() {
  return (
    <div className="App">
    <Header />
      <Routes>
        <Route exact path='/' element={<LoginPage/>}/> 
        <Route exact path='/orders/create/:userId' element={<ProjectCreationPage/>}/>
        <Route exact path='/orders/normalcreate/:userId' element={<NormalCreationPage/>}/>
        <Route exact path='/register' element={<RegisterPage/>}/>
        <Route exact path='/rules' element={<Rules/>}/>
        <Route exact path='/create/driver/:userId/:driver_id' element={<CreateDriver/>}/>
        <Route exact path='/homepage/admin/:userId' element={<HomePageAdmin/>}/>
        <Route exact path='/edit/timetable/:userId/:driver_id' element={<EditTimetable/>}/>
        <Route exact path='/homepage/customer/:userId' element={<HomePageCustomer/>}/>
        <Route exact path='/homepage/driver/:userId' element={<HomePageDriver/>}/>
        <Route exact path='/map/:place11/:place12/:place21/:place22' element={<MapPage/>}/>
        <Route exact path='/leaflet/:place11/:place12/:place21/:place22' element={<GetInfoLeaflet/>}/>
        <Route exact path='/chooseoption/:userId' element={<ChooseOption/>}/>
        <Route exact path='/not-found' element={<NotFoundPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
