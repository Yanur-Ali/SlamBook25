export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
}

export interface SlamBookQuestion {
  id: string;
  text: string;
}

export interface SlamBookAnswer {
  questionId: string;
  answer: string;
}

export interface SlamBook {
  id: string;
  userId: string;
  title: string;
  answers: SlamBookAnswer[];
  createdAt: Date;
  updatedAt: Date;
  theme?: {
    backgroundColor: string;
    fontFamily: string;
  };
}

export interface Comment {
  id: string;
  slamBookId: string;
  userId: string;
  text: string;
  createdAt: Date;
}

export interface Reaction {
  id: string;
  slamBookId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
}