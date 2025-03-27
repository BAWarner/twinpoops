import { NextRequest, NextResponse } from "next/server";

import { Pool } from 'pg';

export async function GET(request: Request){
    try{
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });

        const movieResult = await pool.query('SELECT * FROM movies');
        const movies = movieResult.rows;

        const tmdbIDs = new Set();
        const userIDs = new Set();

        movies.forEach( movie => {
            userIDs.add( movie.added_by )
            tmdbIDs.add( movie.tmdb_id )
        } );

        const userIDArray = [...userIDs];
        const tmdbIDArray = [...tmdbIDs];

        let usersMap: any = null;
        let detailedMovieMap: any = null;


        const tmdbPlaceholders = tmdbIDArray.map( (_,i) => `$${i+1}` ).join(',');
        const detailedMovieQuery = {
            text: `SELECT * FROM tmdb_movies WHERE id IN (${tmdbPlaceholders})`,
            values: tmdbIDArray
        }

        const detailedMovieResult = await pool.query( detailedMovieQuery );

        detailedMovieMap = detailedMovieResult.rows.reduce( (map, movie) => {
            map[movie.id] = movie;
            return map;
        }, {} )

        if( userIDArray.length > 0 ){
            const placeholders = userIDArray.map( (_,i) => `$${i+1}` ).join(',');
            const userQuery = {
                text: `SELECT id, displayname, profile_picture FROM users WHERE id IN (${placeholders})`,
                values: userIDArray
            }

            const usersResult = await pool.query( userQuery );

            usersMap = usersResult.rows.reduce( (map, user) => {
                map[user.id] = user;
                return map;
            }, {} )
        }


        const moviesWithUsers = movies.map( movie => {
            const movieWithUser = { ...movie }

            if( movie.tmdb_id && detailedMovieMap[movie.tmdb_id] ){
                const detailedMovie = detailedMovieMap[movie.tmdb_id];
                const {title, overview, poster_path, genre_ids, release_date} = detailedMovie;

                movieWithUser.title = title;
                movieWithUser.overview = overview;
                movieWithUser.poster_path = poster_path;
                movieWithUser.genre_ids = genre_ids;
                movieWithUser.release_date = release_date;
            }

            if( movie.added_by && usersMap[movie.added_by] ){

                const user = usersMap[movie.added_by];

                movieWithUser.user = {
                    id: user.id,
                    displayname: user.displayname,
                    profilePicture: user.profile_picture
                }
            }

            return movieWithUser;

        } );

        return NextResponse.json( moviesWithUsers );
    }
    catch(err){
        console.error('Database query errror:', err)
        return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
    }
}

export async function PUT(request: Request){
    try{
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        })

        const { category, movie, user } = await request.json();

        const movieQuery = {
            text: 'UPDATE movies SET category = $1 WHERE tmdb_id = $2 RETURNING *',
            values: [category, movie]
        }

        const movieResult = await pool.query( movieQuery );

        const movieDetailQuery =  {
            text: `SELECT * FROM tmdb_movies WHERE id = $1`,
            values: [movie]
        }

        const userQuery = {
            text: `SELECT id, displayname, profile_picture FROM users WHERE id = $1`,
            values: [user]
        }

        const movieDetails = await pool.query( movieDetailQuery );

        const fullMovieDetails = movieDetails.rows[0];
        const updatedMovie = movieResult.rows[0];

        const userDetails = await pool.query( userQuery );

        const userData = userDetails.rows[0];

        const returnMovieObject = { ...updatedMovie, ...fullMovieDetails };

        returnMovieObject.id = updatedMovie.id;
        returnMovieObject.tmdb_id = fullMovieDetails.id;

        
        returnMovieObject.user = {
            id: userData.id,
            displayname: userData.displayname,
            profilePicture: userData.profile_picture
        }

        return NextResponse.json(returnMovieObject, {status: 200});

    }
    catch(err){
        console.error('Error updating database:', err);
        return NextResponse.json({error: 'Updating database failed'}, {status: 500})
    }
}


export async function DELETE(req: NextRequest){
    try{
        
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        })
        
        const movieID = req.nextUrl.searchParams.get('movieID');
        const tmdbID = req.nextUrl.searchParams.get('tmdb_id');

        const removeTMDBQuery = {
            text: `DELETE FROM tmdb_movies WHERE id = $1`,
            values: [tmdbID]
        }

        const removeMovieQuery = {
            text: `DELETE FROM movies WHERE id = $1`,
            values: [movieID]
        }

        const removeMovie = await pool.query( removeMovieQuery );
        const removeTMDB = await pool.query( removeTMDBQuery );


        return NextResponse.json({status: 200})
    }
    catch( err ){
        console.error('Error removing movie from list', err);
        return NextResponse.json({error: 'Remove movie from list failed'}, {status: 500})
    }
}