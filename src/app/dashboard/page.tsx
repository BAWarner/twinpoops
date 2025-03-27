"use client";
import { useState, useEffect, useMemo } from 'react';

import MovieListComponent from "../Components/Movies/MovieList";
import MovieModal from '../Components/Movies/Modal';
import Loading from "../Components/Loading/Loading";
import FiltersForm from '../Components/Movies/Filters';

import GridSVG from '../Components/SVGs/Grid';
import ScrollerSVG from '../Components/SVGs/Scroller';
import FunnelVG from '../Components/SVGs/Funnel';
import FunnelAltVG from '../Components/SVGs/FunnelAlt';

import { useMovies } from "../context/movieContext";
import { MovieList } from '../types/movies.types';

import styles from '../styles/dashboard.module.css';
import RequestMovieModal from '../Components/Request/RequestMovie';

const Dashboard = () => {

    const { movies, categories, users, setMovies } = useMovies();

    const [ filters, setFilters ] = useState<{[key: string]: string | number[]| boolean }>({});
    const [ showFilters, setShowFilters ] = useState<boolean>(false);
    const [ showModal, setShowModal ] = useState<boolean>(false);
    const [ modalMovie, setModalMovie ] = useState<MovieList | null | undefined>();
    const [ filtersActive, setFiltersActive ] = useState<boolean>(false);
    const [ viewType, setViewType ] = useState<string>('scroller');

    const [ gridFill, setGridFill ] = useState<string>('#ECDBBA');
    const [ scrollFill, setScrollFill ] = useState<string>('#C84B31');
    const [ funnelFill, setFunnelFill ] = useState<string>('#ECDBBA');

    const [ showRequestForm, setShowRequestForm ] = useState<boolean>(false);

    const handleChangeViewType = ( newType: string ): void =>{
        setViewType(newType);
        if( newType === 'grid' ){
            setGridFill('#C84B31')
            setScrollFill('#ECDBBA')
        }else if( newType === 'scroller' ){
            setScrollFill('#C84B31')
            setGridFill('#ECDBBA')
        }
    }

    const setUpFilters = (): void => {
        let newFilters: {[key: string]: number[] | boolean} = {};

        if(categories) categories.forEach( category => newFilters[category] = false )
        if(users) newFilters.addedBy = [];

        newFilters = {...newFilters, mo: false}

        setFilters(newFilters)
    }

    const handleShowFilterRow = () => {
        setShowFilters(!showFilters)
    }

    const handleFilterChange = (event: any) => {
        const { name, checked, value } = event.target;
        if( name !== 'addedBy' ){
            setFilters({...filters, [name]: checked});
        }else{
            const currentAddedBy = Array.isArray(filters.addedBy) ? filters.addedBy : [];

            const updatedAddedBy = checked
                ? [...currentAddedBy, Number(value)]
                : currentAddedBy.filter((id: number) => id !== Number(value)); 

            setFilters({ ...filters, addedBy: updatedAddedBy });
        }
    };

    const clearFilters = (): void => {

        const clearedFilters: {[key: string]: number[] | boolean} = {};

        const filterOptions = Object.keys(filters);
        filterOptions.forEach( filter => {
            if( filters[filter] !== 'addedBy' ){
                clearedFilters[filter] = false;
            }else{
                clearedFilters.addedBy = [];
            }
        } );

        setFilters(clearedFilters);
        setFiltersActive(false);
        setFunnelFill('#ECDBBA')
    }

    const toggleModal = (movieDetails: MovieList): void => {
        setShowModal(!showModal);
        setModalMovie(movieDetails);

    }

    useEffect( () => {
        setUpFilters();
    }, [categories, users])

    useEffect( () => {

        if (showModal || showRequestForm) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
        };

    }, [showModal, showRequestForm])

    const filteredList = useMemo(() => {

        const hasActiveFilters = Object.values(filters).some(value => {
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return Boolean(value);
        });
        
        setFiltersActive(hasActiveFilters);
        
        if (!hasActiveFilters) {
            return movies;
        }
        
        return movies?.filter(movie => {
            const categoryFilters = categories?.filter(cat => 
                filters[cat] === true
            );
            if (categoryFilters && categoryFilters.length > 0 && !categoryFilters.includes(movie.category)) {
                return false;
            }
            if (Array.isArray(filters.addedBy) && filters.addedBy.length > 0) {
                if (!filters.addedBy.includes(movie.user.id)) {
                    return false;
                }
            }
            if (filters.mo === true && movie.mo !== true) {
                return false;
            }
            return true;
        });
    }, [filters, movies, categories]);

    return (
        <div className={styles.dashboard}>
            <div className={styles.requestFormWrapper}>
                <button onClick={ () => setShowRequestForm(!showRequestForm) }>Add to list</button>
            </div>
            <div className={styles.filtersWrapper}>
                <div className={styles.left}>
                    {/* <FunnelAltVG fill={funnelFill} handleShowFilterRow={ handleShowFilterRow } /> */}
                    <FunnelVG fill={funnelFill} handleShowFilterRow={ handleShowFilterRow } />
                    {/* <img className={styles.filters} onClick={ () => handleShowFilterRow() } src='/filter-alt.svg' alt='Filters' /> */}
                </div>
                <div className={styles.right}>
                    { filtersActive && <button className='secondary' onClick={ clearFilters }>Clear Filters</button> }

                    <div className={styles.gridView} onClick={ () => handleChangeViewType('grid') } >
                        <GridSVG fill={ gridFill } />
                    </div>
                    <div className={styles.scrollerView} onClick={ () => handleChangeViewType('scroller') } >
                        <ScrollerSVG fill={ scrollFill } />
                    </div>
                </div>
                <div className={`${styles.slideFilters} ${showFilters ? `${styles.open}` : `${styles.closed}`}`}>
                    <FiltersForm
                        categories={ categories }
                        currentFilters={ filters } 
                        handleFilterChange={ handleFilterChange }
                        users={ users }
                    />
                </div>
            </div>


            { !movies && <Loading />}
            { movies && 
                <MovieListComponent 
                    moviesArray={ filteredList } 
                    categories={ categories } 
                    toggleModal={ toggleModal }
                    filtersAreActive={ filtersActive }
                    viewType={ viewType }
                /> 
            }
            { showModal && 
                <MovieModal 
                    movie={ modalMovie } 
                    setShowModal={ setShowModal }
                    setMovies={ setMovies }
                /> 
            }
            {
                showRequestForm
                &&
                <RequestMovieModal setMovies={ setMovies } setShowRequestForm={ setShowRequestForm } />
            }
        </div>
    );
}

export default Dashboard;