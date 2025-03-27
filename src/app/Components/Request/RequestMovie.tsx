import { useState } from 'react';

import MovieListComponentSmall from '../Movies/MovieListSmall';

import { updateMovieLocalStorage } from '@/app/utils/updateLocalStorage';

import { TMDBDataType, OutgoingTMDBStructure, MovieList } from '@/app/types/movies.types';
import styles from '../../styles/request.module.css'
import axios from 'axios';

interface RequestMovieProps{
    setShowRequestForm: ( status: boolean ) => void;
    setMovies: ( (movies: MovieList[]) =>  void ) | null | undefined;
}

const RequestMovieModal = (props: RequestMovieProps) => {

    const { setShowRequestForm, setMovies } = props;

    const [ requestResults, setRequestResults ] = useState<TMDBDataType[]>([]);
    const [ requestedTitle, setRequestedTitle ] = useState<string>('');
    const [ requestedYear, setRequestedYear ] = useState<string>('');

    const [ requestError, setRequestError ] = useState<string>('');

    const [ showConfirmation, setShowConfirmation ] = useState<boolean>(false);
    const [ mo, setMo ] = useState<boolean>(false);
    const [ requestedMovie, setRequestedMovie ] = useState<TMDBDataType>();

    const handleRequestForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const encodedTitle = encodeURIComponent( requestedTitle );

        const options: OutgoingTMDBStructure = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/search/movie',
            params: {
                query: encodedTitle,
                include_adult: 'false',
                page: '1'
            },
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`
            }
        };

        if( requestedYear && requestedYear !== '' ) options.params.year = requestedYear;

        const possibleMovies = await axios
            .request(options)
            .then(res => res.data?.results )
            .catch(err => setRequestError(err));

        setRequestResults( possibleMovies.filter( (movie: TMDBDataType) => movie.poster_path !== null ) );

    }

    const handleSelectMovieFromResult = (movie: TMDBDataType) => {
        setShowConfirmation(!showConfirmation);
        setRequestedMovie(movie);
    }

    const handleAddItToList = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            const updatedMovieDetails = {...requestedMovie, mo}

            const newlyAddedMovie = await axios.post('api/requests', {movie: updatedMovieDetails})
            .then( res => res.data )
            .catch( err => setRequestError( err ) );

            const sendToMovieContext = updateMovieLocalStorage( newlyAddedMovie, true );


            if( setMovies && Array.isArray(sendToMovieContext) ){
                setMovies(sendToMovieContext);
            } 

        }catch( err: any ){
            setRequestError(err.message);
        }
        finally{
            setShowRequestForm(false);
        }
    }

    return (
    <div className={styles.requestMovieWrapper}>
        <button className={styles.close} onClick={ () => setShowRequestForm(false) }>
            <img src='/back.svg' alt='back to dashboard' />
        </button>
        <div className={styles.requestMovieBlock}>
            { requestError && <span className='error'>{requestError}</span> }
            <div className={styles.top}>
                <form onSubmit={handleRequestForm}>
                    <h2 style={{textAlign: 'center', paddingBottom: 24}}>Request a movie</h2>
                    <div className=''>
                        <input 
                            type='text' 
                            value={requestedTitle}
                            name='requestedTitle'
                            onChange={ e => setRequestedTitle(e.target.value) }
                            placeholder='Movie Title'
                        />
                    </div>
                    <div className=''>
                        <input 
                            type='text' 
                            value={requestedYear}
                            name='requestedYear'
                            onChange={ e => setRequestedYear(e.target.value) }
                            placeholder='Release Year'
                        />
                    </div>
                    <div className=''>
                        <button type='submit'>Search</button>
                    </div>
                </form>
            </div>
            <div className={styles.bottom}>
                { requestResults && 
                    <div className={styles.scrollWrapper}>
                        <ul>
                            { requestResults.map( (result: TMDBDataType, i: number) => {
                                const resultKey = result.title.toLowerCase().replaceAll(' ', '-')+i;
                                    return (
                                        <MovieListComponentSmall key={`result-li-for-${resultKey}`} handleSelectMovieFromResult={ handleSelectMovieFromResult } movie={ result } />
                                    )
                                }) 
                            }
                        </ul>
                    </div>
                }
            </div>
        </div>
        { showConfirmation && requestedMovie && 
            <div className={styles.confirmation}>
                Add {requestedMovie.title} to the list?
                <span onClick={ () => setShowConfirmation(false) }>close</span>
                <form onSubmit={ e => handleAddItToList(e) }>
                    <label>
                        <input 
                            type='checkbox' 
                            name='mo' 
                            checked={ mo }
                            onChange={() => setMo(!mo)}
                        />
                        Have to watch it with Miranda
                    </label>
                    <button>Add it, baby!</button>
                </form>
            </div> 
        }
    </div>
    )
}

export default RequestMovieModal;