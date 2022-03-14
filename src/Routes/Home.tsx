import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getLatestMovies, getMovies, getRatedMovies, getUpcomingMovies, IGetMoviesResult, IMovie } from '../api';
import { motion, AnimatePresence, useViewportScroll } from 'framer-motion';
import { useState } from 'react';
import { makeImagePath } from '../utils';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { GrFormNext } from 'react-icons/gr';

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 95vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  font-size: 66px;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-size: cover;
  cursor: pointer;
  &:last-child {
    transform-origin: center right;
  }
  &:first-child {
    transform-origin: center left;
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const Rows = styled.div`
  height: 115vh;
  display: flex;
  flex-direction: column;
  /* background-color: red; */
`;

const Content = styled.div`
  width: 100%;
  height: 45%;
  margin-bottom: 15px;
`;

const ContentHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const ContentTitle = styled.div`
  font-weight: 900;
  font-size: 25px;
  margin-right: 10px;
`;

const NextIcon = styled(GrFormNext)`
  font-size: 30px;
  color: white;
  background-color: white;
  &:hover {
    cursor: pointer;
  }
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

const offset = 6;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/movies/:movieId');
  const { scrollY } = useViewportScroll();

  const { data: nowPlayingData, isLoading: nowPlayingLoading } = useQuery<IGetMoviesResult>(['movies', 'nowPlaying'], getMovies);
  const { data: latestData, isLoading: latestLoading } = useQuery<IMovie>(['movies', 'latest'], getLatestMovies);
  const { data: ratedData, isLoading: ratedLoading } = useQuery<IGetMoviesResult>(['movies', 'rated'], getRatedMovies);
  const { data: upComingData, isLoading: upComingLoading } = useQuery<IGetMoviesResult>(['movies', 'upComing'], getUpcomingMovies);

  const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
  const [ratedIndex, setRatedIndex] = useState(0);
  const [upComingIndex, setUpComingIndex] = useState(0);
  const [nowPlayingLeaving, setNowPlayingLeaving] = useState(false);
  const [ratedLeaving, setRatedLeaving] = useState(false);
  const [upComingLeaving, setUpComingLeaving] = useState(false);

  const loading = nowPlayingLoading || latestLoading || ratedLoading || upComingLoading;

  const increaseIndex = (type: string) => {
    if (type === 'nowPlaying' && nowPlayingData) {
      if (nowPlayingLeaving) return;
      toggleLeaving('nowPlaying');
      const totalMovies = nowPlayingData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setNowPlayingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    } else if (type === 'rated' && ratedData) {
      if (ratedLeaving) return;
      toggleLeaving('rated');
      const totalMovies = ratedData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    } else if (type === 'upComing' && upComingData) {
      if (upComingLeaving) return;
      toggleLeaving('upComing');
      const totalMovies = upComingData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setUpComingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = (type: string) => {
    if (type === 'nowPlaying') {
      setNowPlayingLeaving((prev) => !prev);
    } else if (type === 'rated') {
      setRatedLeaving((prev) => !prev);
    } else if (type === 'upComing') {
      setUpComingLeaving((prev) => !prev);
    }
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const onOverlayClick = () => history.push('/');

  // const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);

  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(nowPlayingData?.results[0].backdrop_path || '')}>
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>
          <Rows>
            <Content>
              <ContentHeader>
                <ContentTitle>Now Playing Movies</ContentTitle>
                {nowPlayingData && nowPlayingData.results.length > 6 && <NextIcon color="#fff" onClick={() => increaseIndex('nowPlaying')} />}
              </ContentHeader>
              <Slider>
                <AnimatePresence initial={false} onExitComplete={() => toggleLeaving('nowPlaying')}>
                  <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: 'tween', duration: 1 }} key={nowPlayingIndex}>
                    {nowPlayingData?.results
                      .slice(1)
                      .slice(offset * nowPlayingIndex, offset * nowPlayingIndex + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ''}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: 'tween' }}
                          key={movie.id}
                          bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
                          onClick={() => onBoxClicked(movie.id)}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </Slider>
            </Content>
            <Content>
              <ContentHeader>
                <ContentTitle>Top Rated Movies</ContentTitle>
                {ratedData && ratedData.results.length > 6 && <NextIcon color="#fff" onClick={() => increaseIndex('rated')} />}
              </ContentHeader>
              <Slider>
                <AnimatePresence initial={false} onExitComplete={() => toggleLeaving('rated')}>
                  <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: 'tween', duration: 1 }} key={ratedIndex}>
                    {ratedData?.results
                      .slice(1)
                      .slice(offset * ratedIndex, offset * ratedIndex + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ''}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: 'tween' }}
                          key={movie.id}
                          bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
                          onClick={() => onBoxClicked(movie.id)}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </Slider>
            </Content>
            <Content>
              <ContentHeader>
                <ContentTitle>Upcoming Movies</ContentTitle>
                {upComingData && upComingData.results.length > 6 && <NextIcon color="#fff" onClick={() => increaseIndex('upComing')} />}
              </ContentHeader>
              <Slider>
                <AnimatePresence initial={false} onExitComplete={() => toggleLeaving('upComing')}>
                  <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: 'tween', duration: 1 }} key={upComingIndex}>
                    {upComingData?.results
                      .slice(1)
                      .slice(offset * upComingIndex, offset * upComingIndex + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ''}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: 'tween' }}
                          key={movie.id}
                          bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
                          onClick={() => onBoxClicked(movie.id)}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </Slider>
            </Content>
            <Content>
              <ContentHeader>
                <ContentTitle>Latest Movies</ContentTitle>
              </ContentHeader>
              <Slider>
                <Row>
                  {latestData && (
                    <Box
                      layoutId={latestData.id + ''}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: 'tween' }}
                      key={latestData.id}
                      bgPhoto={makeImagePath(latestData.backdrop_path, 'w500')}
                      onClick={() => onBoxClicked(latestData.id)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{latestData.title}</h4>
                      </Info>
                    </Box>
                  )}
                </Row>
              </Slider>
            </Content>
            {/* <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                <BigMovie style={{ top: scrollY.get() + 100 }} layoutId={bigMovieMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{ backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path, 'w500')})` }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence> */}
          </Rows>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
