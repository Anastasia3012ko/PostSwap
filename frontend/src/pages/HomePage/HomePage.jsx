import React, { useEffect, useState } from 'react';
import styles from './HomePage.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllPosts } from '../../redux/slices/postSlice';
import PostHome from '../../components/PostHome/PostHome';
import PostModal from '../../components/PostModal/PostModal';

const HomePage = () => {
  const { posts, loading, error } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts || posts.length === 0) return <p>No posts found</p>;

  return (
    <div className={styles.wrapper}>
      {posts.map(post => (
        <PostHome
          key={post._id}
          post={post}
          onOpenModal={() => openModal(post)}
        />
      ))}

      <PostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        post={selectedPost}
      />
    </div>
  );
};

export default HomePage;


