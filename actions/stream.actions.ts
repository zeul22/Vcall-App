"use server";

import { currentUser } from "@clerk/nextjs";
import { StreamClient } from '@stream-io/node-sdk';
const apiKey=process.env.NEXT_PUBLIC_STREAM_API_KEY
const apiSecret=process.env.STREAM_SECRET_KEY;


export const tokenProvider =async()=>{
    const user=await currentUser()
    if(!user) throw new Error('USer is not logged in');
    if(!apiKey) throw new Error('No Api Key')
    if(!apiSecret) throw new Error('No Api Secret')

    const streamClient=new StreamClient(apiKey, apiSecret, { timeout: 3000 });
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60; //hour time
    const issued=Math.floor(Date.now()/1000)-60;

    const token=streamClient.createToken(user.id,exp,issued)
    return token;
}