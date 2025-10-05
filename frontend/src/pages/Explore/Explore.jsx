import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../../redux/slices/postSlice';


const Explore = () => {
const { posts, loading, error } = useSelector((state) => state.post);
const dispatch = useDispatch();

useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts || posts.length === 0) return <p>No posts found</p>;
  console.log(posts);
  
  
  

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <p>{post.description}</p>
          {post.photo && <img src={post.photo.url} alt="post" />}
          <p>By: {post.user.userName}</p>
        </div>
      ))}
    </div>
  )
}

export default Explore