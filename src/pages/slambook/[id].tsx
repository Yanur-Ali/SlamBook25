import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
// Local storage imports
import { getSlamBook, getSlamBookComments, createComment, getSlamBookReactions, toggleReaction } from '@/lib/localStorage';
import { useAuth } from '@/contexts/AuthContext';
import { SlamBook, SlamBookAnswer, Comment, Reaction } from '@/types';
import { SLAM_BOOK_QUESTIONS } from '@/utils/questions';
import { FaHeart, FaThumbsUp, FaLaugh, FaSurprise, FaSadTear } from 'react-icons/fa';

const SlamBookPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser } = useAuth();
  
  const [slamBook, setSlamBook] = useState<SlamBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [newComment, setNewComment] = useState('');
  
  useEffect(() => {
    const fetchSlamBook = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Get slam book from localStorage
        const data = getSlamBook(id as string);
        
        if (data) {
          setSlamBook(data);
          
          // Fetch comments from localStorage
          const commentsData = getSlamBookComments(id as string);
          setComments(commentsData);
          
          // Fetch reactions from localStorage
          const reactionsData = getSlamBookReactions(id as string);
          setReactions(reactionsData);
        } else {
          setError('Slam book not found');
        }
      } catch (error) {
        console.error('Error fetching slam book:', error);
        setError('Failed to load slam book');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSlamBook();
  }, [id]);
  
  const handleAddComment = async () => {
    if (!currentUser || !newComment.trim() || !id) return;
    
    try {
      // Create comment in localStorage
      const newCommentObj = createComment({
        slamBookId: id as string,
        userId: currentUser.id,
        text: newComment
      });
      
      setComments([newCommentObj, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  const handleAddReaction = async (emoji: string) => {
    if (!currentUser || !id) return;
    
    try {
      // Toggle reaction using localStorage
      const result = toggleReaction({
        slamBookId: id as string,
        userId: currentUser.id,
        emoji
      });
      
      if (result === null) {
        // Reaction was removed
        setReactions(reactions.filter(r => !(r.userId === currentUser.id && r.emoji === emoji)));
      } else {
        // Reaction was added
        setReactions([...reactions, result]);
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };
  
  if (loading) {
    return <LoadingContainer>Loading slam book...</LoadingContainer>;
  }
  
  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }
  
  if (!slamBook) {
    return <ErrorContainer>Slam book not found</ErrorContainer>;
  }
  
  // Count reactions by emoji
  const reactionCounts: Record<string, number> = {};
  reactions.forEach(reaction => {
    reactionCounts[reaction.emoji] = (reactionCounts[reaction.emoji] || 0) + 1;
  });
  
  // Check if current user has reacted with each emoji
  const userReactions: Record<string, boolean> = {};
  if (currentUser) {
    reactions.forEach(reaction => {
      if (reaction.userId === currentUser.id) {
        userReactions[reaction.emoji] = true;
      }
    });
  }
  
  return (
    <Container style={{
      backgroundColor: slamBook.theme?.backgroundColor || '#F7FFF7',
      fontFamily: slamBook.theme?.fontFamily || '"Comic Neue", cursive'
    }}>
      <SlamBookContainer>
        <Header>
          <Title>{slamBook.title}</Title>
        </Header>
        
        <QuestionsContainer>
          {SLAM_BOOK_QUESTIONS.map(question => {
            const answer = slamBook.answers.find(a => a.questionId === question.id);
            return (
              <QuestionCard key={question.id}>
                <QuestionText>{question.text}</QuestionText>
                <AnswerText>{answer?.answer || 'No answer provided'}</AnswerText>
              </QuestionCard>
            );
          })}
        </QuestionsContainer>
        
        <ReactionsContainer>
          <SectionTitle>Reactions</SectionTitle>
          <ReactionButtons>
            <ReactionButton 
              active={userReactions['heart'] || false}
              onClick={() => handleAddReaction('heart')}
            >
              <FaHeart /> {reactionCounts['heart'] || 0}
            </ReactionButton>
            <ReactionButton 
              active={userReactions['thumbsUp'] || false}
              onClick={() => handleAddReaction('thumbsUp')}
            >
              <FaThumbsUp /> {reactionCounts['thumbsUp'] || 0}
            </ReactionButton>
            <ReactionButton 
              active={userReactions['laugh'] || false}
              onClick={() => handleAddReaction('laugh')}
            >
              <FaLaugh /> {reactionCounts['laugh'] || 0}
            </ReactionButton>
            <ReactionButton 
              active={userReactions['surprise'] || false}
              onClick={() => handleAddReaction('surprise')}
            >
              <FaSurprise /> {reactionCounts['surprise'] || 0}
            </ReactionButton>
            <ReactionButton 
              active={userReactions['sad'] || false}
              onClick={() => handleAddReaction('sad')}
            >
              <FaSadTear /> {reactionCounts['sad'] || 0}
            </ReactionButton>
          </ReactionButtons>
        </ReactionsContainer>
        
        <CommentsContainer>
          <SectionTitle>Comments</SectionTitle>
          
          {currentUser && (
            <CommentForm>
              <CommentInput 
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <CommentButton onClick={handleAddComment}>Post</CommentButton>
            </CommentForm>
          )}
          
          {comments.length > 0 ? (
            <CommentsList>
              {comments.map(comment => (
                <CommentItem key={comment.id}>
                  <CommentText>{comment.text}</CommentText>
                  <CommentMeta>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </CommentMeta>
                </CommentItem>
              ))}
            </CommentsList>
          ) : (
            <NoCommentsText>No comments yet. Be the first to comment!</NoCommentsText>
          )}
        </CommentsContainer>
        
        <ShareContainer>
          <SectionTitle>Share this Slam Book</SectionTitle>
          <ShareLink>{typeof window !== 'undefined' ? window.location.href : ''}</ShareLink>
          <ShareButton onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          }}>
            Copy Link
          </ShareButton>
        </ShareContainer>
      </SlamBookContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
`;

const SlamBookContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #FF6B6B;
  margin-bottom: 0.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #E84855;
`;

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const QuestionCard = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #4ECDC4;
`;

const QuestionText = styled.h3`
  font-size: 1.2rem;
  color: #1A535C;
  margin-bottom: 0.5rem;
`;

const AnswerText = styled.p`
  font-size: 1.1rem;
  color: #1A535C;
  line-height: 1.5;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #FF6B6B;
  margin-bottom: 1rem;
`;

const ReactionsContainer = styled.div`
  margin-bottom: 2rem;
`;

const ReactionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ReactionButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? '#FFD166' : 'white'};
  border: 2px solid #FFD166;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  
  &:hover {
    background-color: #FFD166;
    transform: scale(1.05);
  }
`;

const CommentsContainer = styled.div`
  margin-bottom: 2rem;
`;

const CommentForm = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: 2px solid #4ECDC4;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #FF6B6B;
  }
`;

const CommentButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #4ECDC4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #3db5ad;
    transform: scale(1.05);
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentItem = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  border-left: 3px solid #4ECDC4;
`;

const CommentText = styled.p`
  font-size: 1.1rem;
  color: #1A535C;
  margin-bottom: 0.5rem;
`;

const CommentMeta = styled.div`
  font-size: 0.9rem;
  color: #888;
`;

const NoCommentsText = styled.p`
  font-size: 1.1rem;
  color: #888;
  font-style: italic;
`;

const ShareContainer = styled.div`
  margin-top: 2rem;
`;

const ShareLink = styled.div`
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  word-break: break-all;
  border: 2px solid #4ECDC4;
`;

const ShareButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #4ECDC4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #3db5ad;
    transform: scale(1.05);
  }
`;

export default SlamBookPage;