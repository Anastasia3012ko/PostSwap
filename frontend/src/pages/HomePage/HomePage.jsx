import React, {useEffect} from 'react'
import styles from './HomePage.module.css'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllPosts } from '../../redux/slices/postSlice';
import PostHome from '../../components/PostHome/PostHome';

const HomePage = () => {
  const { posts, loading, error } = useSelector((state) => state.post);
const dispatch = useDispatch();

useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;
if (!posts || posts.length === 0) return <p>No posts found</p>;
  console.log(posts);

  return (
    <div className={styles.wrapper}>
      {posts && posts.map(post => (
        <div key={post._id}>
          <PostHome post={post}/>
        </div>
        
      ))}
    </div>
  )
}

export default HomePage