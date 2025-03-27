import { MovieList } from "../types/movies.types";

export const updateMovieLocalStorage = ( updatedMovie: MovieList, newAddition?: boolean, removal?: boolean ): MovieList[] | boolean => {
    const cachedMovieKey = 'cachedMovieList';
    const existingCache = localStorage.getItem(cachedMovieKey);
    if( existingCache ){
        try{
            const parsedCache = JSON.parse(existingCache);
            let updatedCache: MovieList[];

            if( Array.isArray(parsedCache) ){

                if( removal ){
                    updatedCache = parsedCache.filter( movie => movie.id !== updatedMovie.id );
                    localStorage.setItem(cachedMovieKey, JSON.stringify( updatedCache ));

                    return updatedCache;
                }

                if(!newAddition){
                    updatedCache = parsedCache.map( movie => movie.id === updatedMovie.id ? { ...movie, ...updatedMovie } : movie )
                }else{
                    updatedCache = [...parsedCache, updatedMovie];
                }
                localStorage.setItem(cachedMovieKey, JSON.stringify( updatedCache ))
                return updatedCache;
            }

        }catch( err ){
            console.error(err);
            throw new Error(`Error updating local storage ${err}`);
        }
    }

    return false;
}