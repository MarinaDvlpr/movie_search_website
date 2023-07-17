import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { setMovies, setCurrentPage } from '../../redux/slices';
import { api } from '../../services';
import { MovieCard, Genres } from '../index';
import './MovieListing.css';

const MovieListing: React.FC = () => {
    const dispatch = useDispatch();
    const { movies, currentPage } = useSelector((state: RootState) => state.movieListing);
    const isLightTheme = useSelector((state: RootState) => state.theme.isLightTheme);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await api.get('/movie/now_playing', { params: { page: currentPage } });
                const newMovies = response.data.results;
                dispatch(setMovies(newMovies));
            } catch (error) {
                console.error(error);
            }
        };

        fetchMovies();
    }, [currentPage, dispatch]);

    const goToNextPage = () => {
        dispatch(setCurrentPage(currentPage + 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            dispatch(setCurrentPage(currentPage - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className={`movie-listing ${isLightTheme ? 'light-theme' : 'dark-theme'}`}>
            <Genres />
            <div className="movie-listing-container">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}

                <div className="pagination">
                    <button className="general-button" onClick={goToPreviousPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <button className="general-button" onClick={goToNextPage}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieListing;

