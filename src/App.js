import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import HomeScreen from "./components/home/HomeScreen";
import Step1 from "./components/step1/step1";
import Step2 from "./components/step2/step2";
import { useEffect, useState } from "react";
import Step3 from "./components/step3/step3";

function App() {

  const [ userData , setUserData ] = useState({})

  useEffect( () => {
    console.log("Userdata update")
    console.log(userData)
  } , [] )

  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen userData={userData} setUserData={setUserData}/>} />
        <Route path="/step1" element={<Step1 userData={userData} setUserData={setUserData} />} />
        <Route path="/step2" element={<Step2 userData={userData} setUserData={setUserData} />} />
        <Route path="/step3" element={<Step3 userData={userData} setUserData={setUserData} />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
