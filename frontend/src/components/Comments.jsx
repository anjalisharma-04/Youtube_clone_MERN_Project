// frontend/src/components/Comments.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCommentsByVideoId,
  addComment,
  deleteComment,
  updateComment,
} from '../Redux/slice/commentsSlice';
import { FaUserCircle } from 'react-icons/fa';
import { useToast } from '../hooks/use-toast';

// Single comment item
const CommentItem = ({ comment, videoId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [showOptions, setShowOptions] = useState(false);

  const dispatch = useDispatch();
  const { toast } = useToast();
  const currentUser = useSelector((state) => state.auth.user);

  const handleUpdate = () => {
    dispatch(updateComment({ videoId, commentId: comment._id, newComment: editedText }))
      .then(() => {
        setIsEditing(false);
        toast({ title: 'Comment updated successfully!' });
      })
      .catch((err) => console.error('Update failed:', err));
  };

  const handleRemove = () => {
    dispatch(deleteComment({ videoId, commentId: comment._id }))
      .then(() => toast({ title: 'Comment deleted successfully!' }))
      .catch((err) => console.error('Delete failed:', err));
  };

  return (
    <div className="flex items-start gap-4 border-b p-4">
      <div>
        <img
          className="w-10 h-10 rounded-full"
          src={comment.userAvatar || FaUserCircle}
          alt="avatar"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold">{comment.userName}</span>
          {currentUser && currentUser._id === comment.userId && (
            <div className="relative">
              <button onClick={() => setShowOptions(!showOptions)} className="text-gray-500">
                ...
              </button>
              {showOptions && (
                <div className="absolute right-0 bg-white border shadow rounded p-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleRemove}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleUpdate}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Save
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {isEditing ? (
          <input
            type="text"
            className="border rounded w-full mt-2"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          <p>{comment.text}</p>
        )}
      </div>
    </div>
  );
};

// Comments section component
const Comments = ({ videoId }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const authStatus = useSelector((state) => state.auth.status);
  const comments = useSelector((state) => state.comments.comments);

  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    dispatch(fetchCommentsByVideoId(videoId));
  }, [dispatch, videoId]);

  const handleAddComment = (e) => {
    e.preventDefault();

    if (!authStatus) {
      toast({
        variant: 'destructive',
        title: 'Please login to post a comment.',
      });
      return;
    }

    if (commentText.trim()) {
      dispatch(addComment({ videoId, comment: commentText }))
        .then(() => {
          setCommentText('');
          toast({ title: 'Comment posted successfully!' });
        })
        .catch((err) => console.error('Add comment error:', err));
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      <form onSubmit={handleAddComment} className="mb-4">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border rounded p-2"
        />
        <div className="text-right mt-2">
          <button type="submit" className="bg-black text-white px-5 py-2 rounded-full">
            Submit
          </button>
        </div>
      </form>

      {comments.map((cmt) => (
        <CommentItem key={cmt._id} comment={cmt} videoId={videoId} />
      ))}
    </div>
  );
};

export default Comments;
