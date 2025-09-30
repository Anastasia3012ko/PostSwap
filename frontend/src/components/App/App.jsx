import { Routes, Route } from 'react-router-dom';
import Layout from '../Layout/Layout';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import HomePage from '../../pages/HomePage/HomePage';
import SingUp from '../../pages/SingUp/SingUp';
import Login from '../../pages/Login/Login';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Explore from '../../pages/Explore/Explore';
import MyProfile from '../../pages/MyProfile/MyProfile';
import MyPost from '../../pages/MyPost/MyPost';
import AddPost from '../../pages/AddPost/AddPost';
import Messages from '../../pages/Messages/Messages';
import EditProfile from '../../pages/EditProfile/EditProfile';
import EditPost from '../../pages/EditPost/EditPost';
import OtherProfile from '../../pages/OtherProfile/OtherProfile';
import OtherPost from '../../pages/OtherPost/OtherPost';
import NotFound from '../../pages/NotFound/NotFound';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Layout><HomePage /></Layout>}/>
        <Route path='/register' element={<SingUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset' element={<ResetPassword/>} />
        <Route path='/explore' element={<Layout><Explore /></Layout>} />
        <Route path='/chat' element={<Layout><Messages /></Layout>} />
        <Route path='/myProfile' element={<Layout><MyProfile /></Layout>}/>
        <Route path='/editProfile' element={<Layout><EditProfile /></Layout>}/>
        <Route path='/myPost' element={<Layout><MyPost /></Layout>} />
        <Route path='/editPost' element={<Layout><EditPost /></Layout>}/>
        <Route path='/addPost' element={<Layout><AddPost /></Layout>}/>
        <Route path='/otherProfile' element={<Layout><OtherProfile /></Layout>}/>
        <Route path='/otherPost' element={<Layout><OtherPost/></Layout>}/>
        <Route path='*' element={<Layout><NotFound /></Layout>}/>
      </Routes>
      <ScrollToTop />
    </div>
  );
}

export default App;
