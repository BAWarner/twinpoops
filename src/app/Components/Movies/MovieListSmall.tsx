import { TMDBDataType } from "../../types/movies.types";
import styles from '../../styles/movieList.module.css';

interface MovieListSmallComponentType{
    movie: TMDBDataType;
    handleSelectMovieFromResult: (movie: TMDBDataType) => void;
}

const MovieListComponentSmall = (props: MovieListSmallComponentType) => {

    const { movie, handleSelectMovieFromResult } = props;
    const { overview, poster_path, title, } = movie;

    
    const poster = poster_path;

    return ( 
        <li onClick={ () => handleSelectMovieFromResult(movie) } className={styles.movieListSmall}>
            {poster && ( <img src={`https://image.tmdb.org/t/p/original/${poster}`} className={styles.poster} alt={title} />)}
            {title && <span>{title}</span>}
            {overview && <p>{overview}</p>}
        </li> 
);
}

export default MovieListComponentSmall;