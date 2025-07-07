import { BrowserRouter,Routes,Route } from 'react-router-dom';
import DashBoard from './pages/DashBoard';
import OverView from './pages/OverView';
import Profile from './pages/Profile';


const App = () => {
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/dashboard' element={<DashBoard />} />
      <Route path='/dashboard/overview' element={<OverView />} />
      <Route path='/dashboard/profile' element={<Profile />} />
    </Routes>
    </BrowserRouter>
  )
};

export default App;
