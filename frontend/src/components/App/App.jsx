import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
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
import { useDispatch } from 'react-redux';
import { checkAuth } from '../../redux/slices/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<SingUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Layout>
                <Explore />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Layout>
                <Messages />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Profile/:userId"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editProfile"
          element={
            <ProtectedRoute>
              <Layout>
                <EditProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/myPost"
          element={
            <ProtectedRoute>
              <Layout>
                <MyPost />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editPost"
          element={
            <ProtectedRoute>
              <Layout>
                <EditPost />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
      <ScrollToTop />
    </div>
  );
}

export default App;
