'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import NodeCache from 'node-cache';
import { MovieContextType, MovieContextProps, MovieList, UserType } from '../types/movies.types';

export const movieCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const MovieContext = createContext< MovieContextType | undefined>( undefined );

export const MovieProvider:  React.FC<MovieContextProps> = ({children, initialMovies}) => {


    const [ movies, setMovies ] = useState<MovieList[] | null>(initialMovies);
    const [ categories, setCategories ] = useState<string[] | null>(null);
    const [ movieError, setMovieError ] = useState<string>('');
    const [ users, setUsers ] = useState<UserType[] | null>(); 

    const cachedMovieKey = 'cachedMovieList';
    

    const getMovies = async () => {
        const cachedMovies: string | MovieList[] | undefined = localStorage.getItem(cachedMovieKey) || movieCache.get(cachedMovieKey);
        if( cachedMovies ){
            console.log('Movie list fetched from cache');

            let parsedList;

            const categorySet: Set<string> = new Set();

            if( typeof cachedMovies === 'string' ){
                parsedList = JSON.parse(cachedMovies)
            }else{
                parsedList = cachedMovies;
            }
            setMovies(parsedList);
            parsedList.forEach( (movie: MovieList) => {
                categorySet.add(movie.category)

            } )

            const uniqueUsers = parsedList.reduce((accumulator: any, currentObj: MovieList) => {
                if (!accumulator.set.has(currentObj.user.id)) {
                    accumulator.set.add(currentObj.user.id);
                    accumulator.result.push(currentObj.user);
                }
                return accumulator;
            }, { set: new Set(), result: [] }).result; 

            setCategories([...categorySet])
            setUsers([...uniqueUsers])

        }else{
            try{
                await axios.get('/api/db')
                .then( res => {
                    const { data } = res;
                    const categorySet: Set<string> = new Set();
                    setMovies( data );
    
                    data.forEach( (movie: MovieList) => {
                        categorySet.add( movie.category );
                    })
                    localStorage.setItem(cachedMovieKey, JSON.stringify(data))
                    movieCache.set(cachedMovieKey, data);
                    setCategories([...categorySet]);

                    const uniqueUsers = data.reduce((accumulator: any, currentObj: MovieList) => {
                        if (!accumulator.set.has(currentObj.user.id)) {
                            accumulator.set.add(currentObj.user.id);
                            accumulator.result.push(currentObj.user);
                        }
                        return accumulator;
                    }, { set: new Set(), result: [] }).result; 

                    setUsers([...uniqueUsers])
    
                } )
            }
            catch( err: any ){
                setMovieError( err.message )
            }
        }
    }

    useEffect(() => {
        if( typeof window !== 'undefined' )
            getMovies();
    }, [])

    return(
        <MovieContext.Provider value={{ movies, categories, users, movieError, setMovies, setCategories }}>
            {children}
        </MovieContext.Provider>
    )

}

export const useMovies = () => {
    const context = useContext(MovieContext);
    if(!context) throw new Error('useMovies must be used within a MovieProvider')

    return context;
};