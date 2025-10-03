import { Routes, Route } from 'react-router-dom';
import Layout from '../Layout/Layout';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import HomePage from '../../pages/HomePage/HomePage';
import SingUp from '../../pages/SingUp/SingUp';
import Login from '../../pages/Login/Login';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Explore from '../../pages/Explore/Explore';
import Profile from '../../pages/Profile/Profile';
import MyPost from '../../pages/MyPost/MyPost';
import AddPost from '../../pages/AddPost/AddPost';
import Messages from '../../pages/Messages/Messages';
import EditProfile from '../../pages/EditProfile/EditProfile';
import EditPost from '../../pages/EditPost/EditPost';
import ProtectedRoute from '../../utils/ProtectedRoute';
import NotFound from '../../pages/NotFoundPage/NotFoundPage';


function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ProtectedRoute><Layout><HomePage/></Layout></ProtectedRoute>}/>
         <Route path="/register" element={<SingUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/explore" element={<Layout><Explore /></Layout>}/>
        <Route path="/chat"element={<Layout><Messages /></Layout>}/>
        <Route path="/Profile/:userId" element={<Layout><Profile /></Layout>} />
        <Route path="/editProfile" element={<Layout><EditProfile /></Layout>}/>
        <Route path="/myPost" element={<Layout><MyPost/></Layout>} />
        <Route path="/editPost" element={<Layout><EditPost /></Layout>}/> 
        <Route path="/addPost" element={<Layout><AddPost /></Layout>}/>  
        <Route path="*" element={<Layout><NotFound /></Layout>}/>    
      </Routes>
      <ScrollToTop />
    </div>
  );  
          
}

export default App            
              
            
          
        
       
;
        
            
          
        
        
        
          
          
            
              
            
          
        
        
          
          
            
              
            
          
        

       
       
          
          
            
              
            
          
        
      