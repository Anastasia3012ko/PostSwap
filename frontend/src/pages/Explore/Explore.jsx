import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPosts } from '../../redux/slices/postSlice';
import styles from './Explore.module.css'


const Explore = () => {
const { posts, loading, error } = useSelector((state) => state.post);
const dispatch = useDispatch();

useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  function shuffleFisherYates(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
const shuffledPosts = shuffleFisherYates(posts);

  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts || posts.length === 0) return <p>No posts found</p>;
  console.log(posts);
  
  
return (
    <div className={styles.posts}>
      {shuffledPosts.map((post, index) => (
        <div key={post._id} className={layout[index]}>
          {post.photo && <img src={post.photo.url} alt={`photo-${index}`}/>}
        </div>
      ))}
    </div>
  )
}

export default Explore