import React, { useEffect, useState } from "react";
import { IonCard, IonCardContent, IonIcon } from "@ionic/react";
import { chatbubbleEllipsesOutline, eyeOutline } from "ionicons/icons";
import { Link } from "react-router-dom";

import "./ForumCard.css";

type ForumPost = {
  id: number;
  title: string;
  category: string;

  views: number;
  comments: { id: number; text: string }[];
  image: string;
  user: string;
  date: string;
};

interface ForumCardProps {
  post: ForumPost;
}

const ForumCard: React.FC<ForumCardProps> = ({ post }) => {
  const [commentCount, setCommentCount] = useState<number>(
    post.comments.length
  );

  useEffect(() => {
    const getCommentCountFromStorage = () => {
      const savedPost = localStorage.getItem(`post-${post.id}`);
      if (savedPost) {
        const parsedPost = JSON.parse(savedPost);
        return parsedPost.comments.length;
      }
      return post.comments.length;
    };

    setCommentCount(getCommentCountFromStorage());

    const handleStorageUpdate = () => {
      setCommentCount(getCommentCountFromStorage());
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [post.id, post.comments.length]);

  return (
    <IonCard className="forum-card">
      <div className="card-header">
        <img src={post.image} alt="Avatar" className="avatar" />
        <div className="user-date">
          <span className="user">{post.user}</span>
          <span className="date">{post.date}</span>
        </div>
      </div>
      <div className="card-body">
        <div className="category">{post.category}</div>
        <h3 className="title">{post.title}</h3>
      </div>
      <IonCardContent>
        <div className="footer">
          <div className="views">
            <IonIcon icon={eyeOutline} />
            <span>{post.views}</span>
          </div>
          <div className="comments">
            <Link to={`/comments/${post.id}`}>
              <IonIcon icon={chatbubbleEllipsesOutline} />
              <span>{commentCount}</span>
            </Link>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ForumCard;
