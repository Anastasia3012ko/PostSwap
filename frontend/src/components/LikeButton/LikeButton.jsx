import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePost, unlikePost } from "../../redux/slices/likeSlice";

function LikeButton({ postId }) {
  const dispatch = useDispatch();
  const likesCount = useSelector((state) => state.likes.entities[postId] || 0);
  const userLikes = useSelector((state) => state.likes.userLikes[postId] || false);
  const loading = useSelector((state) => state.likes.loading);

  const toggleLike = () => {
    if (userLikes) {
      dispatch(unlikePost(postId));
    } else {
      dispatch(likePost(postId));
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "20px",
      }}
    >
      {userLikes ? "❤️" : "🤍"} {likesCount}
    </button>
  );
}

export default LikeButton