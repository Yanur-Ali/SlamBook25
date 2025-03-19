import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
// Local storage imports
import { getUserSlamBooks, deleteSlamBook } from '@/lib/localStorage';
import { useAuth } from '@/contexts/AuthContext';
import { SlamBook } from '@/types';
import { COLOR_PALETTES, FONT_FAMILIES } from '@/styles/theme';
import { toast } from 'react-toastify';

const MySlamBooksPage = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [slamBooks, setSlamBooks] = useState<SlamBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not logged in
  React.useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  useEffect(() => {
    const fetchSlamBooks = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        // Get slam books from localStorage
        const slamBooksData = getUserSlamBooks(currentUser.id);

        // Sort by creation date (newest first)
        slamBooksData.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        setSlamBooks(slamBooksData);
      } catch (error) {
        console.error('Error fetching slam books:', error);
        setError('Failed to load your slam books');
      } finally {
        setLoading(false);
      }
    };

    fetchSlamBooks();
  }, [currentUser]);

  const handleViewSlamBook = (id: string) => {
    router.push(`/slambook/${id}`);
  };

  const handleCreateNew = () => {
    router.push('/create');
  };

  const handleDeleteSlamBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slam book? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete slam book from localStorage
      deleteSlamBook(id);
      setSlamBooks(slamBooks.filter(book => book.id !== id));
      toast.success('Slam book deleted successfully!');
    } catch (error) {
      console.error('Error deleting slam book:', error);
      toast.error('Failed to delete slam book');
    }
  };

  if (loading) {
    return <LoadingContainer>Loading your slam books...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  return (
    <Container>
      <Header>
        <Title>My Slam Books</Title>
        <Subtitle>View and manage your slam books</Subtitle>
      </Header>

      <ActionButton onClick={handleCreateNew}>Create New Slam Book</ActionButton>

      {slamBooks.length > 0 ? (
        <SlamBooksGrid>
          {slamBooks.map(slamBook => {
            // Format the date
            const createdAt = new Date(slamBook.createdAt);
            const formattedDate = createdAt.toLocaleDateString();

            return (
              <SlamBookCard key={slamBook.id}>
                <SlamBookTitle>{slamBook.title}</SlamBookTitle>
                <SlamBookDate>Created on {formattedDate}</SlamBookDate>
                <SlamBookAnswers>
                  {slamBook.answers.length} questions answered
                </SlamBookAnswers>
                <ButtonGroup>
                  <ViewButton onClick={() => handleViewSlamBook(slamBook.id)}>
                    View
                  </ViewButton>
                  <DeleteButton onClick={() => handleDeleteSlamBook(slamBook.id)}>
                    Delete
                  </DeleteButton>
                </ButtonGroup>
              </SlamBookCard>
            );
          })}
        </SlamBooksGrid>
      ) : (
        <EmptyState>
          <EmptyStateText>You haven't created any slam books yet.</EmptyStateText>
          <EmptyStateSubtext>
            Create your first slam book to share with friends!
          </EmptyStateSubtext>
        </EmptyState>
      )}
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

const ActionButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-family: ${FONT_FAMILIES.HANDWRITTEN};
  font-weight: bold;
  background-color: ${COLOR_PALETTES.RETRO.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2rem;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SlamBooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const SlamBookCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 3px solid ${COLOR_PALETTES.RETRO.accent};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const SlamBookTitle = styled.h2`
  font-size: 1.5rem;
  color: ${COLOR_PALETTES.RETRO.primary};
  margin-bottom: 0.5rem;
`;

const SlamBookDate = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 0.5rem;
`;

const SlamBookAnswers = styled.p`
  font-size: 1rem;
  color: ${COLOR_PALETTES.RETRO.text};
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ViewButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  background-color: ${COLOR_PALETTES.RETRO.secondary};
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

const DeleteButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  background-color: white;
  color: #E84855;
  border: 2px solid #E84855;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #E84855;
    color: white;
    transform: scale(1.05);
  }
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 3px solid ${COLOR_PALETTES.RETRO.accent};
  max-width: 600px;
  width: 100%;
`;

const EmptyStateText = styled.h2`
  font-size: 1.5rem;
  color: ${COLOR_PALETTES.RETRO.primary};
  margin-bottom: 1rem;
`;

const EmptyStateSubtext = styled.p`
  font-size: 1.2rem;
  color: ${COLOR_PALETTES.RETRO.text};
`;

export default MySlamBooksPage;