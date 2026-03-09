import { useState, useEffect } from 'react';
import api from '../config/api';
import PostCard from '../components/PostCard';
import { Post } from '../types';

export default function Trending() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    try {
      const { data } = await api.get('/posts/trending');
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  return (
    <div className="container">
      {posts.map(post => (
        <PostCard key={post._id} post={post} onUpdate={updatePost} />
      ))}
    </div>
  );
}
