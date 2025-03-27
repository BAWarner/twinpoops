import { MovieList } from "../../types/movies.types";
import styles from '../../styles/movieList.module.css';
import User from "../UserDetails/User";

import { useState, useEffect } from 'react';

interface MovieListComponentType{
    moviesArray: MovieList[] | null | undefined;
    categories: string[] | undefined | null;
    toggleModal: ( movie: MovieList ) => void;
    filtersAreActive?: boolean;
    viewType: string;
}

const MovieListComponent = (props: MovieListComponentType) => {

    const { moviesArray, toggleModal, filtersAreActive, viewType } = props;
    const [ movieCategories, setMovieCategories ] = useState<string[]>([]);

    useEffect( () => {
        const uniqueCategories: Set<string> = new Set();
        moviesArray?.forEach( movie => uniqueCategories.add(movie.category) )
        setMovieCategories([...uniqueCategories].sort());

    }, [moviesArray])


    const generateMovieTitle = (): string => {
        const randomNumber = Math.floor( Math.random() * 26 );
        const randomNumberForString = Math.floor( Math.random() * 8 );
        const numberStringArray = ['Hundred', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Septillion' ];

        const numberString = numberStringArray[ randomNumberForString ]

        return `${randomNumber} ${numberString} Beavers`;
    }

    

    if( moviesArray && moviesArray.length > 0 ){
        return (
            <div className={styles.listContainer}>

                { movieCategories && movieCategories.map( category => {
                    const movieLength = moviesArray.filter(movie => movie.category === category).length
                    return(
                        <div className={`${styles.row} ${styles[viewType]}`} key={`row-for-${category}`}>
    
                            <h2>{category}<span>{` (${movieLength})`}</span></h2>
    
                            <div className={styles.scrollContainer}>
                                <ul>
    
                                    { moviesArray.filter(movie => movie.category === category).map(movie => {
                                        const movieKey = movie.title.toLowerCase().replaceAll(' ', '-');
                                        const movieTitle = movie.title === 'Hundreds of Beavers' ? generateMovieTitle() : movie.title;
                                        const poster = movie.poster_path;
                                        const { user, overview } = movie;
    
                                        return (
                                            <li key={`list-item-for-${movieKey}`} onClick={() => toggleModal(movie)}>
                                                {poster && ( <img src={poster} className={styles.poster} alt={movie.title} />)}
                                                <div className={styles.showOnHover}>
                                                    {movieTitle && <span className={styles.movieTitle}>{movieTitle}</span>}
                                                    {overview && <p>{overview}</p>}
                                                    {user && (
                                                        <div className={styles.userWrapper}>
                                                            <p>Added by:</p>
                                                            <User user={user} />
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
    
                            </div>
    
                        </div>
                    )
                }
                )}
            </div>
        )
    }else if( !moviesArray && filtersAreActive || moviesArray && moviesArray.length == 0 && filtersAreActive ){
        return (
            <>
                <h2>No movies found</h2> 
                <p>If filtering, there are no movies that match this criteria. Try filtering a different way.</p>
            </>
        )
    }


    return ( <h2>Loading...</h2> );
}

export default MovieListComponent