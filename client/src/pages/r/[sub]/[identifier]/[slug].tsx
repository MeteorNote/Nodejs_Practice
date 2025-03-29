import axios from "axios";
import classNames from "classnames";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import useSWR from 'swr';
import { useAuthState } from "../../../../context/auth";
import { Comment, Post } from "../../../../types";
import { FaArrowUp, FaArrowDown, FaHeartBroken, FaHeart, FaHeartbeat} from "react-icons/fa";

const PostPage = () => {
    const router = useRouter();
    const { identifier, sub, slug } = router.query;
    const { authenticated, user} = useAuthState();
    const [newComment, setNewComment] = useState("");
    const {data:post, error, mutate:postMutate} = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}`:
    null);

    const { data:comments, mutate:commentMutate} = useSWR<Comment[]>(
        identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
    )

    console.log("comment",comments)
    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault();
        if(newComment.trim() === ""){
            return;
        }
        try {
            await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`,{
                body:newComment
            });
            commentMutate();
            setNewComment("");
        } catch (error) {
            console.log(error);
        }
    }

    const vote = async (value: number, comment?:Comment) =>{
        if(!authenticated) router.push("/login");
        if(
            (!comment && value === post?.userVote) ||
            (comment && comment.userVote === value)
        ) {
            value = 0
        }
        try {
            await axios.post("/votes",{
                identifier,
                slug,
                commentIdentifier: comment?.identifier,
                value
            })
            postMutate();
            commentMutate();
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex max-w-5xl px-4 pt-5 mx-auto">
            <div className="w-full md:mr-3 md:w-12/12">
                <div className="bg-white rounded">
                    {post && (
                        <>
                            <div className="flex">
                                {/*좋실기능*/}
                                <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                                    <div
                                    className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer
                                    hover:bg-gray-300 hover:text-red-500"
                                    onClick={() => vote(1)}
                                    >
                                        {post.userVote === 1 ?
                                            <FaHeart className="text-red-500"/>:<FaHeart/>}
                                    </div>
                                    <p className="text-xs font-bold pt-1">{post.voteScore}</p>
                                    <div
                                    className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer
                                    hover:bg-gray-300 hover:text-blue-500 pt-1" 
                                    onClick={() => vote(-1)}
                                    >
                                       {post.userVote === -1 ?
                                            <FaHeartBroken className="text-blue-500"/>:<FaHeartBroken/>}
                                    </div>
                                </div>


                                <div className="py-2 pr-2 ">
                                    <div className="flex items-center">
                                        <p className="text-xs text-gray-400 ">
                                            작성자
                                            <Link href ={`/u/${post.username}`}>
                                                <a className="mx-1 hover:underline ">
                                                    {post.username}
                                                </a>
                                            </Link>
                                            <Link href ={post.url}>
                                                <a className="mx-1 hover:underline">
                                                    {dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}
                                                </a>
                                            </Link>
                                        </p>
                                    </div>
                                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                                    <p className="my-3 text-sm">{post.body}</p>
                                    <div className="flex">
                                        <button>
                                            <i className=" fas fa-comment-alt fa-xs "></i>
                                            <span className="font-bold text-blue-400">
                                                {post.commentCount} 답글쓰기
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>



                                    {/*댓글*/}
                                    <div className="pl-10 pr-6 mb-4">
                                        {authenticated ?
                                        (<div>
                                            <p className="mb-1 text-xs">
                                                <Link href={`/u/${user?.username}`}>
                                                    <a className="font-semibold text-blue 500">
                                                        {user?.username}
                                                    </a>
                                                </Link>
                                                {" "}으로 댓글 작성
                                            </p>
                                            <form onSubmit={handleSubmit}>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded
                                                    focus:outline-none focus:border-gray-600"
                                                    onChange={e=>setNewComment(e.target.value)}
                                                    value={newComment}
                                                >
                                                </textarea>
                                                <div className="flex justify-end  pb-1">
                                                    <button 
                                                        className="px-3 py-1 text-white bg-blue-400 rounded"
                                                        disabled={newComment.trim() === ""}
                                                    >
                                                        댓글 작성
                                                    </button>
                                                    
                                                </div>
                                                    
                                            </form>
                                            </div>
                                            )
                                        :
                                        (<div className="flex items-center justify-between px-2 py-4 border
                                        border-gray-200 rounded">
                                            <p className="font-semibold text-gray-400">
                                                댓글 작성을 위해 로그인 하세요.
                                            </p>
                                            <div>
                                                <Link href={`/login`}>
                                                    <a className="px-3 py-1 text-white bg-gray-400 rounded">
                                                        로그인
                                                    </a>
                                                </Link>
                                            </div>
                                        </div>)}
                                    </div>

                            {/*댓글리스트*/}
                            <hr className="hrcss"></hr>
                            {comments?.map(comment => (
                                <div className="flex" key={comment.identifier}>

                                    {/*좋실기능*/}
                                    <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                                        <div
                                        className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer
                                        hover:bg-gray-300 hover:text-red-500"
                                        onClick={() => vote(1, comment)}
                                        >
                                            {comment.userVote === 1 ?
                                            <FaHeart className="text-red-500"/>:<FaHeart/>}
                                        </div>
                                        <p className="text-xs font-bold">{comment.voteScore}</p>
                                        <div
                                        className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer
                                        hover:bg-gray-300 hover:text-blue-500"
                                        onClick={() => vote(-1, comment)}
                                        >
                                            {comment.userVote === -1 ?
                                            <FaHeartBroken className="text-blue-500"/>:<FaHeartBroken/>}
                                        </div>
                                    </div>



                                    <div className="py-2 pr-2">
                                        <p className="mb-1 text-xs loading-none">
                                            <Link href={`/u/${comment.username}`}>
                                                <a className="mr-1 font-bold hover:underline">
                                                    {comment.username}
                                                </a>
                                            </Link>
                                            <span className="text-gray-600">
                                                {`
                                                ${comment.voteScore}
                                                posts
                                                ${dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
                                                `
                                                }
                                            </span>
                                        </p>
                                        <p>{comment.body}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostPage