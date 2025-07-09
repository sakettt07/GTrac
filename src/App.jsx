import { BrowserRouter,Routes,Route } from 'react-router-dom';
import DashBoard from './pages/DashBoard';
import OverView from './pages/OverView';
import Profile from './pages/Profile';
import Home from './pages/Home'
import Analytics from './pages/Analytics';


const App = () => {
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/dashboard' element={<DashBoard />} />
      <Route path='/dashboard/overview' element={<OverView />} />
      <Route path='/dashboard/profile' element={<Profile />} />
      <Route path='/dashboard/analytics' element={<Analytics />} />
    </Routes>
    </BrowserRouter>
  )
};

export default App;
