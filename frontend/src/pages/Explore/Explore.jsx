import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPosts } from '../../redux/slices/postSlice';
import styles from './Explore.module.css';
import PostModal from '../../components/PostModal/PostModal';

const Explore = () => {
  const { posts, loading, error } = useSelector((state) => state.post);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [shuffledPosts, setShuffledPosts] = useState([]);

  const dispatch = useDispatch();

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const shuffleFisherYates = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      setShuffledPosts(shuffleFisherYates(posts));
    }
  }, [posts]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts || posts.length === 0) return <p>No posts found</p>;

  return (
    <div className={styles.posts}>
      {shuffledPosts.map((post, index) => {
        // Паттерн повторяется каждые 10 элементов
        // Первая партия (index % 10): 0 1 2 3 4 -> третий элемент (index % 10 === 2) вытянут
        // Вторая партия (index % 10): 5 6 7 8 9 -> первый элемент (index % 10 === 5) вытянут
        const mod = index % 10;
        let isTall = false;

        if (mod === 2) {
          // Первая партия: третья колонка вытянута
          isTall = true;
        } else if (mod === 5) {
          // Вторая партия: первая колонка вытянута
          isTall = true;
        }

        return (
          <div
            key={post._id}
            className={isTall ? styles.tall : ''}
            
          >
            <div className={styles.postWrapper} onClick={() => openModal(post)}>
              {post.photo && <img src={post.photo.url} alt={`photo-${index}`} />}
            </div>
            
          </div>
        );
      })}
      <PostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        post={selectedPost}
      />
    </div>
  );
};

export default Explore;
