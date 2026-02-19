import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { Post } from '../types';
import api from '../config/api';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await api.get('/posts/feed');
      setPosts(data.posts);
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
