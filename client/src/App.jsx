import {BrowserRouter, Routes, Route} from 'react-router-dom';
import DropPage from './pages/DropPage';
import HomePage from './pages/homePage';
import GestureDetector from './components/GestureDetector';
import { useState } from 'react'; 

const App = () => {
  const [currentGesture, setCurrentGesture] = useState(null);
  const [gestureConfidence, setGestureConfidence] = useState(0);

  const handleGesture= (gesture, confidence) => {
    setCurrentGesture(gesture);
    setGestureConfidence(confidence);
  };



  return (
    <BrowserRouter>
    <GestureDetector onGesture={handleGesture}/>
    <Routes>
      <Route path="/" element={<HomePage currentGesture={currentGesture} gestureConfidence={gestureConfidence}/>} />
      <Route path="/drop" element={<DropPage currentGesture={currentGesture} gestureConfidence={gestureConfidence}/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
