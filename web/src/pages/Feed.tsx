import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { Post } from '../types';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/posts/feed');
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
