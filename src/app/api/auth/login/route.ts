import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Pool } from 'pg';


export async function POST( request: Request ){

    try{
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        })

        const { username, password } = await request.json();
        const cleanUsername = username.toLowerCase();

        const userQuery = {
            text: 'SELECT id, username, displayname, password_hash FROM users WHERE username = $1',
            values: [cleanUsername]
        }

        const userResult = await pool.query( userQuery );

        const user = userResult.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if(!passwordMatch) {
            return NextResponse.json(
                {error: 'Invalid username or password'},
                {status: 401}
            )
        }

        const token = jwt.sign(
            { 
                id: user.id,
                username: user.username
            },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        )

        const cookieStore = await cookies();

        cookieStore.set({
            name: 'auth-token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60,
            path: '/'
          });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                displayname: user.displayname
            }
        })
    }
    catch( err ){
        console.error('Login error:', err);
        return NextResponse.json({error: 'Authentication error'}, {status: 500})
    }
}

async function generateTestHash(password:string){
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    console.log(`Party on, Garth! Password (${password}): ${hash}`);
}