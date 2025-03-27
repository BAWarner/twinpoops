import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const authenticateUser = async  (): Promise<number | null | NextResponse> => {

    const userInfo: { id: number | null } = {
        id: null
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
        return NextResponse.json({ message: 'No token provided' }, {status: 401});
    }

    const tokenValue = token.value;

    jwt.verify(tokenValue, process.env.JWT_SECRET!, (err, decoded) => {
        if (err) {
            return NextResponse.json({ message: 'Invalid, or expired token' }, {status: 401});
        }

        if( decoded && typeof decoded !== 'string' && 'id' in decoded ){
            userInfo.id = decoded.id
        }
    });

    return userInfo.id;
};

export async function POST(req: NextRequest): Promise<NextResponse>{

    const { movie } = await req.json();
    const { title, id: tmdb_id, overview, poster_path, genre_ids, release_date, backdrop_path, mo } = movie;

    const currentUserID = await authenticateUser();

    if( Number.isNaN(currentUserID) ) return NextResponse.json({ message: 'Invalid, or expired token' }, {status: 401});

    try{

        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        })

        const realPosterPath = `https://image.tmdb.org/t/p/original/${poster_path}`
        const realBackdropPath = `https://image.tmdb.org/t/p/original/${backdrop_path}`
        const realGenreIDs = genre_ids.join(',');

        const postToTMDB = {
            text: `
            INSERT INTO tmdb_movies (title, tmdb_id, overview, poster_path, release_date, genre_ids, backdrop_path)
            VALUES($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
            values: [title, tmdb_id, overview, realPosterPath, release_date, realGenreIDs, realBackdropPath]
        }

        const postResult = await pool.query( postToTMDB );
        const fullMovieDetails = postResult.rows[0];

        const postToMovie = {
            text: `INSERT INTO movies (added_by, tmdb_id, mo, category)
            VALUES($1, $2, $3, 'Unwatched')
            RETURNING *`,
            values: [ currentUserID, fullMovieDetails.id, mo]
        }

        const postToMovieResult = await pool.query( postToMovie );
        const movieDBObject = postToMovieResult.rows[0];

        const userQuery = {
            text: `SELECT id, displayname, profile_picture FROM users WHERE id = $1`,
            values: [currentUserID]
        }
        const userResult = await pool.query( userQuery );
        const userData = userResult.rows[0];

        const returnMovieObject = { ...movieDBObject, ...fullMovieDetails };

        returnMovieObject.id = movieDBObject.id;
        returnMovieObject.tmdb_id = fullMovieDetails.id;

        
        returnMovieObject.user = {
            id: userData.id,
            displayname: userData.displayname,
            profilePicture: userData.profile_picture
        }
        
        return NextResponse.json(returnMovieObject, {status: 200})

    
    }
    catch( err ){
        console.error('Error adding movie to the list:', err)
        return NextResponse.json({ error: 'Error adding movie to the list' }, { status: 500 })
    }

}