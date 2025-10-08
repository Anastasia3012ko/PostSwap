import React, { useState, useRef, useEffect } from 'react';
import styles from './Emojis.module.css';

const EMOJIS = [
  '😀','😂','😍','😎','😢','😡','🤔','🤗',
  '👍','👎','🙏','👏','💪','❤️','💔','🎉',
  '🥳','😴','🤯','😱','🤩','😇','🤪','🙃',
  '😋','😜','😏','🤤','🤫','😬','🫡','🥰'
];

const Emojis = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const pickerRef = useRef();

  // Закрываем панель при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojis(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit({ text });
      setText('');
    }
  };

  return (
    <div className={styles.commentWrapper}>
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <button
          type="button"
          className={styles.emojiButton}
          onClick={() => setShowEmojis(!showEmojis)}
        >
          😊
        </button>

        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.commentInput}
        />

        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>

      {showEmojis && (
        <div className={styles.emojiPicker} ref={pickerRef}>
          {EMOJIS.map((emoji, idx) => (
            <span
              key={idx}
              className={styles.emoji}
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Emojis