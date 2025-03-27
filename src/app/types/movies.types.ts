import { ReactNode } from "react";

export interface MovieContextType{
    movies: MovieList[] | null;
    categories?: string[] | null;
    movieError?: string;
    users?: UserType[] | null;
    setMovies?: React.Dispatch<React.SetStateAction<MovieList[] | null>>;
    setCategories?: React.Dispatch<React.SetStateAction<string[] | null>>;
}

export interface MovieContextProps{
    children: ReactNode;
    initialMovies: MovieList[];
}

export interface MovieList{
    title: string;
    poster_path?: string;
    overview?: string;
    addedBy: number;
    category: string;
    tmdb_id: number;
    mo?: boolean;
    user: UserType;
    id?: number
    backdrop_path?: string;
}

export type UserType = {
    id: number;
    displayname: string;
    profilePicture?: string;
}


export interface TMDBDataType{
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: string[] | null;
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;

}

export interface OutgoingTMDBStructure{
    method: string;
    url: string;
    params: {
        query: string;
        include_adult: boolean | string,
        page: number | string;
        year?: string;
    },
    headers: {
        accept: string;
        Authorization: string;
    }
}