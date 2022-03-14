const API_KEY = '569699cea8b1b8000bccb345b5dd27a3';
const BASE_PATH = 'https://api.themoviedb.org/3';

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface ITvShow {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetSearchTvResult {
  page: number;
  results: ITvShow[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response) => response.json());
}

export function getSearchMovies(query: string) {
  return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${query}`).then((response) => response.json());
}

export function getSearchTvShows(query: string) {
  return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${query}`).then((response) => response.json());
}

export function getLatestMovies() {
  return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then((response) => response.json());
}

export function getRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then((response) => response.json());
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then((response) => response.json());
}

export function getLatestShows() {
  return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then((response) => response.json());
}

export function getAiringToday() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then((response) => response.json());
}

export function getPopularShows() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) => response.json());
}

export function getTopRatedShows() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then((response) => response.json());
}
