/**
 * Local storage utility functions to replace Firebase Firestore
 */

import { User, SlamBook, Comment, Reaction } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Storage keys
const USERS_KEY = 'slam_book_users';
const SLAMBOOKS_KEY = 'slam_books';
const COMMENTS_KEY = 'slam_book_comments';
const REACTIONS_KEY = 'slam_book_reactions';
const CURRENT_USER_KEY = 'slam_book_current_user';

// Helper function to get data from localStorage
const getFromStorage = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  if (!data) return [];
  
  // Parse the JSON data
  const parsedData = JSON.parse(data);
  
  // Convert date strings back to Date objects
  return parsedData.map((item: any) => {
    if (item.createdAt) item.createdAt = new Date(item.createdAt);
    if (item.updatedAt) item.updatedAt = new Date(item.updatedAt);
    return item;
  });
};

// Helper function to set data in localStorage
const setInStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

// User functions
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const createUser = (name: string, email: string, photoURL?: string): User => {
  const users = getFromStorage<User>(USERS_KEY);
  
  // Check if user with this email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) return existingUser;
  
  // Create new user
  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    photoURL: photoURL || '',
    createdAt: new Date()
  };
  
  users.push(newUser);
  setInStorage(USERS_KEY, users);
  setCurrentUser(newUser);
  
  return newUser;
};

export const getUser = (id: string): User | null => {
  const users = getFromStorage<User>(USERS_KEY);
  return users.find(user => user.id === id) || null;
};

// SlamBook functions
export const createSlamBook = (slamBook: Omit<SlamBook, 'id' | 'createdAt' | 'updatedAt'>): SlamBook => {
  const slamBooks = getFromStorage<SlamBook>(SLAMBOOKS_KEY);
  
  const newSlamBook: SlamBook = {
    ...slamBook,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  slamBooks.push(newSlamBook);
  setInStorage(SLAMBOOKS_KEY, slamBooks);
  
  return newSlamBook;
};

export const getSlamBook = (id: string): SlamBook | null => {
  const slamBooks = getFromStorage<SlamBook>(SLAMBOOKS_KEY);
  return slamBooks.find(book => book.id === id) || null;
};

export const getUserSlamBooks = (userId: string): SlamBook[] => {
  const slamBooks = getFromStorage<SlamBook>(SLAMBOOKS_KEY);
  return slamBooks.filter(book => book.userId === userId);
};

export const deleteSlamBook = (id: string): void => {
  const slamBooks = getFromStorage<SlamBook>(SLAMBOOKS_KEY);
  const updatedSlamBooks = slamBooks.filter(book => book.id !== id);
  setInStorage(SLAMBOOKS_KEY, updatedSlamBooks);
  
  // Also delete related comments and reactions
  const comments = getFromStorage<Comment>(COMMENTS_KEY);
  const updatedComments = comments.filter(comment => comment.slamBookId !== id);
  setInStorage(COMMENTS_KEY, updatedComments);
  
  const reactions = getFromStorage<Reaction>(REACTIONS_KEY);
  const updatedReactions = reactions.filter(reaction => reaction.slamBookId !== id);
  setInStorage(REACTIONS_KEY, updatedReactions);
};

// Comment functions
export const createComment = (comment: Omit<Comment, 'id' | 'createdAt'>): Comment => {
  const comments = getFromStorage<Comment>(COMMENTS_KEY);
  
  const newComment: Comment = {
    ...comment,
    id: uuidv4(),
    createdAt: new Date()
  };
  
  comments.push(newComment);
  setInStorage(COMMENTS_KEY, comments);
  
  return newComment;
};

export const getSlamBookComments = (slamBookId: string): Comment[] => {
  const comments = getFromStorage<Comment>(COMMENTS_KEY);
  return comments
    .filter(comment => comment.slamBookId === slamBookId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Reaction functions
export const toggleReaction = (reaction: Omit<Reaction, 'id' | 'createdAt'>): Reaction | null => {
  const reactions = getFromStorage<Reaction>(REACTIONS_KEY);
  
  // Check if user already reacted with this emoji
  const existingReactionIndex = reactions.findIndex(
    r => r.slamBookId === reaction.slamBookId && 
         r.userId === reaction.userId && 
         r.emoji === reaction.emoji
  );
  
  if (existingReactionIndex >= 0) {
    // Remove the reaction (toggle off)
    const existingReaction = reactions[existingReactionIndex];
    reactions.splice(existingReactionIndex, 1);
    setInStorage(REACTIONS_KEY, reactions);
    return null;
  } else {
    // Add the reaction
    const newReaction: Reaction = {
      ...reaction,
      id: uuidv4(),
      createdAt: new Date()
    };
    
    reactions.push(newReaction);
    setInStorage(REACTIONS_KEY, reactions);
    
    return newReaction;
  }
};

export const getSlamBookReactions = (slamBookId: string): Reaction[] => {
  const reactions = getFromStorage<Reaction>(REACTIONS_KEY);
  return reactions.filter(reaction => reaction.slamBookId === slamBookId);
};