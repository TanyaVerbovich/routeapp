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


function App() {
  return (
    <div className="App">
    <Header />
      <Routes>
        <Route exact path='/' element={<LoginPage/>}/> 
        <Route exact path='/orders/create/:userId' element={<ProjectCreationPage/>}/>
        <Route exact path='/register' element={<RegisterPage/>}/>
        <Route exact path='/rules' element={<Rules/>}/>
        <Route exact path='/create/driver/:userId/:driver_id' element={<CreateDriver/>}/>
        <Route exact path='/homepage/admin/:userId' element={<HomePageAdmin/>}/>
        <Route exact path='/edit/timetable/:userId/:driver_id' element={<EditTimetable/>}/>
        <Route exact path='/homepage/customer/:userId' element={<HomePageCustomer/>}/>
        <Route exact path='/not-found' element={<NotFoundPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
