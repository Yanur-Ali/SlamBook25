import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import { COLOR_PALETTES, FONT_FAMILIES } from '@/styles/theme';

const HomePage = () => {
  const router = useRouter();
  const { currentUser, signInWithGoogle } = useAuth();

  const handleCreateSlamBook = () => {
    if (currentUser) {
      router.push('/create');
    } else {
      // Prompt user to sign in first
      signInWithGoogle();
    }
  };

  const handleViewMySlamBooks = () => {
    if (currentUser) {
      router.push('/my-slambooks');
    } else {
      // Prompt user to sign in first
      signInWithGoogle();
    }
  };

  return (
    <Container>
      <Header>
        <Title>Digital Slam Book</Title>
        <Subtitle>Share your thoughts with friends!</Subtitle>
      </Header>

      <ButtonContainer>
        <ActionButton onClick={handleCreateSlamBook}>
          Create New Slam Book
        </ActionButton>
        
        {currentUser && (
          <ActionButton secondary onClick={handleViewMySlamBooks}>
            View My Slam Books
          </ActionButton>
        )}

        {!currentUser && (
          <ActionButton secondary onClick={signInWithGoogle}>
            Sign In with Google
          </ActionButton>
        )}
      </ButtonContainer>

      <FeatureSection>
        <FeatureTitle>What is a Slam Book?</FeatureTitle>
        <FeatureDescription>
          A slam book is a notebook passed among friends where each person answers
          a set of questions about themselves. Our digital version lets you create,
          share, and collect responses from friends online!
        </FeatureDescription>

        <FeatureList>
          <FeatureItem>✓ Create your own slam book</FeatureItem>
          <FeatureItem>✓ Share with friends via a unique link</FeatureItem>
          <FeatureItem>✓ Customize with fun themes and fonts</FeatureItem>
          <FeatureItem>✓ Comment and react to entries</FeatureItem>
        </FeatureList>
      </FeatureSection>
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

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  color: ${COLOR_PALETTES.RETRO.primary};
  margin-bottom: 0.5rem;
  text-shadow: 3px 3px 0px ${COLOR_PALETTES.RETRO.accent};
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: ${COLOR_PALETTES.RETRO.text};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin-bottom: 3rem;
`;

const ActionButton = styled.button<{ secondary?: boolean }>`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-family: ${FONT_FAMILIES.HANDWRITTEN};
  font-weight: bold;
  border: 3px solid ${props => props.secondary ? COLOR_PALETTES.RETRO.secondary : COLOR_PALETTES.RETRO.primary};
  background-color: ${props => props.secondary ? 'transparent' : COLOR_PALETTES.RETRO.primary};
  color: ${props => props.secondary ? COLOR_PALETTES.RETRO.secondary : 'white'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureSection = styled.section`
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border: 3px solid ${COLOR_PALETTES.RETRO.accent};
`;

const FeatureTitle = styled.h2`
  font-size: 2rem;
  color: ${COLOR_PALETTES.RETRO.primary};
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: ${COLOR_PALETTES.RETRO.text};
`;

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  color: ${COLOR_PALETTES.RETRO.text};
`;

export default HomePage;