import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { createSlamBook } from '@/lib/localStorage';
import { useAuth } from '@/contexts/AuthContext';
import { SLAM_BOOK_QUESTIONS } from '@/utils/questions';
import { SlamBookAnswer } from '@/types';
import { COLOR_PALETTES, FONT_FAMILIES } from '@/styles/theme';

const CreatePage = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('My Slam Book');
  const [answers, setAnswers] = useState<SlamBookAnswer[]>([]);
  const [selectedTheme, setSelectedTheme] = useState('RETRO');
  const [selectedFont, setSelectedFont] = useState('HANDWRITTEN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    const existingAnswerIndex = answers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      const updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = { questionId, answer };
      setAnswers(updatedAnswers);
    } else {
      setAnswers([...answers, { questionId, answer }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('You must be logged in to create a slam book');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create the slam book using localStorage
      const newSlamBook = createSlamBook({
        userId: currentUser.id,
        title,
        answers,
        theme: {
          backgroundColor: COLOR_PALETTES[selectedTheme as keyof typeof COLOR_PALETTES].background,
          fontFamily: FONT_FAMILIES[selectedFont as keyof typeof FONT_FAMILIES],
        }
      });
      
      toast.success('Slam book created successfully!');
      router.push(`/slambook/${newSlamBook.id}`);
    } catch (error) {
      console.error('Error creating slam book:', error);
      toast.error('Failed to create slam book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <FormContainer onSubmit={handleSubmit}>
        <Header>
          <Title>Create Your Slam Book</Title>
          <Subtitle>Fill out the questions below to create your slam book</Subtitle>
        </Header>

        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>

        <ThemeSection>
          <SectionTitle>Choose a Theme</SectionTitle>
          <ThemeOptions>
            {Object.keys(COLOR_PALETTES).map((theme) => (
              <ThemeOption 
                key={theme}
                selected={selectedTheme === theme}
                onClick={() => setSelectedTheme(theme)}
                backgroundColor={COLOR_PALETTES[theme as keyof typeof COLOR_PALETTES].background}
                accentColor={COLOR_PALETTES[theme as keyof typeof COLOR_PALETTES].primary}
              >
                {theme}
              </ThemeOption>
            ))}
          </ThemeOptions>
        </ThemeSection>

        <ThemeSection>
          <SectionTitle>Choose a Font</SectionTitle>
          <FontOptions>
            {Object.keys(FONT_FAMILIES).map((font) => (
              <FontOption 
                key={font}
                selected={selectedFont === font}
                onClick={() => setSelectedFont(font)}
                fontFamily={FONT_FAMILIES[font as keyof typeof FONT_FAMILIES]}
              >
                {font}
              </FontOption>
            ))}
          </FontOptions>
        </ThemeSection>

        <QuestionsContainer>
          <SectionTitle>Answer the Questions</SectionTitle>
          {SLAM_BOOK_QUESTIONS.map((question) => (
            <FormGroup key={question.id}>
              <Label htmlFor={`question-${question.id}`}>{question.text}</Label>
              <TextArea
                id={`question-${question.id}`}
                rows={3}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              />
            </FormGroup>
          ))}
        </QuestionsContainer>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Slam Book'}
        </SubmitButton>
      </FormContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${COLOR_PALETTES.RETRO.background};
  font-family: ${FONT_FAMILIES.HANDWRITTEN};
`;

const FormContainer = styled.form`
  width: 100%;
  max-width: 800px;
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border: 3px solid ${COLOR_PALETTES.RETRO.accent};
  margin-bottom: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${COLOR_PALETTES.RETRO.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${COLOR_PALETTES.RETRO.text};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: ${COLOR_PALETTES.RETRO.text};
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 2px solid ${COLOR_PALETTES.RETRO.secondary};
  border-radius: 8px;
  font-family: ${FONT_FAMILIES.HANDWRITTEN};
  
  &:focus {
    outline: none;
    border-color: ${COLOR_PALETTES.RETRO.primary};
    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 2px solid ${COLOR_PALETTES.RETRO.secondary};
  border-radius: 8px;
  resize: vertical;
  font-family: ${FONT_FAMILIES.HANDWRITTEN};
  
  &:focus {
    outline: none;
    border-color: ${COLOR_PALETTES.RETRO.primary};
    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
  }
`;

const ThemeSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${COLOR_PALETTES.RETRO.primary};
  margin-bottom: 1rem;
`;

const ThemeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ThemeOption = styled.div<{ selected: boolean; backgroundColor: string; accentColor: string }>`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.backgroundColor};
  border: 3px solid ${props => props.selected ? props.accentColor : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  color: ${COLOR_PALETTES.RETRO.text};
  
  &:hover {
    transform: scale(1.05);
  }
`;

const FontOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FontOption = styled.div<{ selected: boolean; fontFamily: string }>`
  padding: 1rem;
  border-radius: 8px;
  background-color: white;
  border: 3px solid ${props => props.selected ? COLOR_PALETTES.RETRO.primary : COLOR_PALETTES.RETRO.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: ${props => props.fontFamily};
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  color: ${COLOR_PALETTES.RETRO.text};
  
  &:hover {
    transform: scale(1.05);
  }
`;

const QuestionsContainer = styled.div`
  margin-top: 2rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  background-color: ${COLOR_PALETTES.RETRO.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: ${FONT_FAMILIES.HANDWRITTEN};
  margin-top: 2rem;
  
  &:hover:not(:disabled) {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default CreatePage;