import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import { FaArrowAltCircleDown, FaArrowCircleDown, FaArrowDown, FaArrowUp, FaHeart, FaHeartBroken, FaRegThumbsDown, FaRegThumbsUp, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { Post } from "../types";
import axios from 'axios'
import { useRouter} from 'next/router'
import {useAuthState} from '../context/auth'
import Image from 'next/image'

interface PostCardProps {
    post: Post
    subMutate?: () => void
    mutate?: () => void
}
const PostCard = ({
    
    post : {
    identifier, slug, title, body, subName, createdAt, voteScore, userVote, commentCount, url, username, sub
},
    mutate,
    subMutate
}:PostCardProps) => {
    const router = useRouter()
    const isInSubPage = router.pathname === '/r/[sub]'
    console.log('router.pathname', router.pathname);
    const {authenticated} = useAuthState();
    const vote = async (value: number)=>{
        if(!authenticated) router.push("/login");
        if(value === userVote) value = 0;
        try {
            await axios.post("/votes",{identifier, slug, value});
            if(mutate) mutate();
            if(subMutate) subMutate();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div
            className="flex mb-4 bg-white rounded"
            id={identifier}
        > 
            {/*좋실기능*/}
            <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                <div
                className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer
                hover:bg-gray-300 hover:text-red-500"
                onClick={() => vote(1)}
                >
                    {userVote === 1 ?
                    <FaHeart className="text-red-500"/>:<FaHeart/>}
                </div>
                <p className="text-xs font-bold pt-1">{voteScore}</p>
                <div
                className="flex justify-center w-6 pt-1 mx-auto text-gray-400 rounded cursor-pointer
                hover:bg-gray-300 hover:text-blue-500"
                onClick={() => vote(-1)}
                >
                    {userVote === -1 ?
                    <FaHeartBroken className="text-blue-500"/>:<FaHeartBroken/>}
                </div>
            </div>

            

            <div className="w-full p-2">
                {!isInSubPage &&(
                    <div className="flex items-center">
                        <Link href={`/r/${subName}`} passHref>
                            <a>
                                <Image
                                    src={sub!.imageUrl}
                                    alt="sub"
                                    className="rounded-full cursor-pointer"
                                    width={12}
                                    height={12}
                                />
                            </a>
                        </Link>
                        <Link href={`/r/${subName}`}>
                            <a className="ml-2 text-xs font-bold cursor-pointer hover:underline">
                                {/*/r/*/}{subName}
                            </a>
                        </Link>
                        <span className="mx-1 text-xs text-gray-400"></span>
                    </div>
                    )}

                    <p className="float-right text-xs text-gray-400">
                        작성자 : 
                        <Link href={`/u/${username}`}>
                            <a className="mx-1 hover:underline">{/*/u/*/}{username}</a>
                        </Link>
                        <Link href={url}>
                            <a className="mx-1 hover:underline ">
                                {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
                            </a>
                        </Link>
                    </p>
            <Link href ={url}>
                <a className="my-1 text-lg font-bold">{title}</a>
            </Link>
            {body && <p className="my-2 text-sm">{body}</p>}
            <div className="pt-7 flex text-xs text-gray-400 font-medium">
                <Link href={url}>
                    <a>
                        <i className="mr-0 fas fa-comment-alt fa-xs "></i>
                        <span>답글 : {commentCount}</span>
                    </a>
                </Link>
                </div>
            </div>
        </div>
    )
}

export default PostCard