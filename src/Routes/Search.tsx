import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { getSearchMovies, getSearchTvShows, IGetMoviesResult, IGetSearchTvResult } from '../api';
import { makeImagePath } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GrNext } from 'react-icons/gr';

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  font-weight: 900;
  font-size: 25px;
  margin-right: 10px;
`;

const Rows = styled.div`
  margin-top: 75px;
  height: 90vh;
  display: flex;
  flex-direction: column;
`;

const MovieRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(9, 1fr);
  position: absolute;
  width: 100%;
`;

const TvRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(9, 1fr);
  position: absolute;
  width: 100%;
`;

const Slider = styled.div`
  position: relative;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 270px;
  font-size: 66px;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-size: cover;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  opacity: 0;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 45%;
`;

const ContentHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const NextIcon = styled(GrNext)`
  font-size: 30px;
  font-weight: bolder;
  &:hover {
    cursor: pointer;
  }
  z-index: 99;
  position: absolute;
  right: 0px;
  margin: 105px 0px;
  background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.3));
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    y: -50,
    scale: 1.3,
    transition: {
      delay: 0.4,
      duration: 0.3,
      type: 'tween',
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.3,
      type: 'tween',
    },
  },
};

const offset = 9;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword');

  const { data: movieData, isLoading: movieLoading } = useQuery<IGetMoviesResult>(['search', 'movie'], async () => keyword && getSearchMovies(keyword));
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetSearchTvResult>(['search', 'tv'], async () => keyword && getSearchTvShows(keyword));

  const [movieIndex, setMovieIndex] = useState(0);
  const [movieLeaving, setMovieLeaving] = useState(false);
  const [tvIndex, setTvIndex] = useState(0);
  const [tvLeaving, setTvLeaving] = useState(false);

  const loading = movieLoading || tvLoading;

  const increaseIndex = (type: string) => {
    if (type === 'movie' && movieData) {
      if (movieLeaving) return;
      toggleLeaving('movie');
      const totalMovies = movieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMovieIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
    if (type === 'tv' && tvData) {
      if (tvLeaving) return;
      toggleLeaving('tv');
      const totalMovies = tvData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = (type: string) => {
    if (type === 'movie') {
      setMovieLeaving((prev) => !prev);
    }
    if (type === 'tv') {
      setTvLeaving((prev) => !prev);
    }
  };

  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Rows>
          <Content>
            <ContentHeader>
              <Title>Movie Results</Title>
            </ContentHeader>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={() => toggleLeaving('movie')}>
                <MovieRow variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: 'tween', duration: 1 }} key={movieIndex}>
                  {movieData?.results.slice(offset * movieIndex, offset * movieIndex + offset).map((movie) => (
                    <Box
                      layoutId={movie.id + 'movie'}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: 'tween' }}
                      key={movie.id}
                      bgPhoto={makeImagePath(movie.poster_path, 'w500')}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
                </MovieRow>
              </AnimatePresence>
            </Slider>
            {movieData && movieData.results.length > 9 && <NextIcon onClick={() => increaseIndex('movie')} />}
          </Content>
          <Content>
            <ContentHeader>
              <Title>TV Results</Title>
            </ContentHeader>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={() => toggleLeaving('tv')}>
                <TvRow variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: 'tween', duration: 1 }} key={tvIndex}>
                  {tvData?.results.slice(offset * tvIndex, offset * tvIndex + offset).map((movie) => (
                    <Box
                      layoutId={movie.id + 'tv'}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: 'tween' }}
                      key={movie.id}
                      bgPhoto={makeImagePath(movie.poster_path, 'w500')}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.name}</h4>
                      </Info>
                    </Box>
                  ))}
                </TvRow>
              </AnimatePresence>
            </Slider>
            {movieData && movieData.results.length > 9 && <NextIcon onClick={() => increaseIndex('tv')} />}
          </Content>
        </Rows>
      )}
    </Wrapper>
  );
}

export default Search;
