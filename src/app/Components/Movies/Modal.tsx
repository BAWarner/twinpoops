import { MovieList } from '@/app/types/movies.types';
import styles from '../../styles/movieModal.module.css';

import UserLarge from '../UserDetails/UserLarge';

import axios from 'axios';

import { updateMovieLocalStorage } from '@/app/utils/updateLocalStorage';

import { useState } from 'react';

interface MovieModalProps{
    movie: MovieList | null | undefined;
    setShowModal: ( arg: boolean ) => void;
    setMovies: ( (movies: MovieList[]) =>  void ) | null | undefined;
}

const MovieModal = (props: MovieModalProps) => {
    const { movie, setShowModal, setMovies } = props;

    const [ confirmRemoval, setConfirmRemoval ] = useState<boolean>(false);

    if(!movie){
        setShowModal(false);
        return null;
    }

    const { title, overview, poster_path, user, mo, category, tmdb_id } = movie;

    const handleChangeWatchStatus = async (e: React.FormEvent, incomingCategory: string) => {
        e.preventDefault();
        try{
            const updatedMovie = await axios.put('api/db', {category: incomingCategory, movie: tmdb_id, user: user.id}, { headers: {
                "Content-Type": 'application/json'
            } })
            .then( res => res.data )
            .catch( err => {
                throw new Error( err || 'Failed to update movie watch status' );
            } );

            const sendToMovieContext = updateMovieLocalStorage( updatedMovie );

            if( setMovies && Array.isArray(sendToMovieContext) ) setMovies(sendToMovieContext);

        }catch( err: any ){
            throw new Error(`Error updating movie record`, err);
        }
        finally{
            setShowModal(false);
        }
    }

    const handleDeleteFromList = async (e: any) => {
        e.preventDefault();
        try{
            await axios.delete('api/db', {
                params: {
                    movieID: movie.id,
                    tmdb_id
                }
            })
            .then( res => console.log(res.data) )
            .catch( err => {
                throw new Error (err || 'Removal from list failed')
            } )

            const sendToMovieContext = updateMovieLocalStorage( movie, false, true );

            if(setMovies && Array.isArray(sendToMovieContext)) setMovies(sendToMovieContext)

        }
        catch( err: any ){
            throw new Error( 'Error removing from list', err )
        }
        finally{
            setConfirmRemoval(false);
            setShowModal(false);
        } 
            
    }

    return (
        <div className={styles.movieModal}>
            <div className={styles.modalDetails}>
            <button className={styles.close} onClick={ () => setShowModal(false) }>&times;</button>
                <div className={styles.left}>
                    <h3>{ title }</h3>
                    { overview && <p>{overview}</p>}
                    { user && <UserLarge user={user} /> }
                    { category && <div className={styles.categoryRow}><span>{category}</span></div> }
                    { mo && <div className={styles.mirandaRow}><span className='mo'>Better watch this one with Miranda, or else...</span></div> }
                </div>
                {
                    poster_path &&
                    <div className={styles.right}>
                        <img src={poster_path} alt={title} />
                    </div>
                }
                <div className={styles.bottom}>
                    <form onSubmit={ e => handleChangeWatchStatus(e, category === 'Watched' ? 'Unwatched' : 'Watched') }>
                        <button type='submit'>Mark as { category === 'Watched' ? 'Unwatched' : 'Watched' }</button>
                    </form>
                    <button className={styles.remove} onClick={ () => setConfirmRemoval(true) }>
                        <img src='/trash.svg' alt='Remove from list'/>
                    </button>
                    { confirmRemoval && 
                        <form className={styles.confirmation} onSubmit={ e => handleDeleteFromList(e) }>
                            <span onClick={ () => setConfirmRemoval(false) }>close</span>
                            <h4>Are you sure you want to remove this movie?</h4>
                            <button type='submit'>Remove movie</button>
                        </form>
                    }
                </div>
            </div>
        </div>
    )
}

export default MovieModal;