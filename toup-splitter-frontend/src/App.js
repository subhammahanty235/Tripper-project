
import './App.css';
import Homepage from './pages/homepage/Homepage';
import Loginpage from './pages/loginpage/Loginpage';
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
function App() {
  
  return (
    <>
      {/* <h1>width:{width} height:{height}</h1> */}
      <Router>
          <Routes>
            <Route path='/login' element={<Loginpage/>}/>
            <Route path='/' element={<Homepage/>}/>
          </Routes>
      </Router>
      {/* <Loginpage/> */}
      {/* <Homepage/> */}
    
    </>
  );
}

export default App;
