import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers, clearSearchResults } from '../../redux/slices/userSlice';
import Avatar from '../Avatar/Avatar';
import styles from './SearchUser.module.css';

const SearchUser = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const { searchResults, loading, error } = useSelector(state => state.user);
  const debounceRef = useRef(null);

  //
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const trimmedQuery = query.trim();

      if (trimmedQuery !== '') {
        dispatch(searchUsers(trimmedQuery));
      } else {
        dispatch(clearSearchResults());
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query, dispatch]);


  const handleCloseSearch = () => {
    setQuery('');
    dispatch(clearSearchResults());
  };
console.log(searchResults)

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type='text'
          placeholder='Search'
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button className={styles.clearBtn} onClick={handleCloseSearch}>
            ×
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3 style={{fontSize: '16px', marginTop: '35px', marginLeft: '16px'}}>Recent</h3>
      <ul className={styles.list}>
        {searchResults.map(user => (
          <li key={user._id} className={styles.li}>
            <Avatar size={38} src={user.avatar?.url} />
            <h5 className={styles.userName}>{user.userName}</h5>
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchUser;
