import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikes, unlikePost, likePost } from "../../redux/slices/likeSlice";

function LikeButton({ postId }) {
  const dispatch = useDispatch();

  
  const post = useSelector((state) => state.likes.entities[postId]);
  const processing = useSelector((state) => state.likes.processing?.[postId]) || false;
  const error = useSelector((state) => state.likes.error);
console.log(post);

  // Если данных нет — подтягиваем все лайки
  useEffect(() => {
    if (!post) {
      dispatch(fetchLikes());
    }
  }, [dispatch, post]);

  const likesCount = post?.likesCount || 0;
  const userLiked = post?.userLiked || false;

  const toggleLike = async () => {
    if (processing) return; // блокировка на конкретный пост

    try {
      if (userLiked) {
        await dispatch(unlikePost(postId)).unwrap();
      } else {
        await dispatch(likePost(postId)).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={processing}
      style={{
        background: "none",
        border: "none",
        cursor: processing ? "not-allowed" : "pointer",
        fontSize: "15px",
        color: 'var(--text-color)'
      }}
      title={processing ? "Processing..." : userLiked ? "Unlike" : "Like"}
    >
      {userLiked ? "❤️" : "🤍"} {processing ? "…" : likesCount}
      {error && <span style={{ color: "red", marginLeft: 5 }}>!</span>}
    </button>
  );
}

export default LikeButton;