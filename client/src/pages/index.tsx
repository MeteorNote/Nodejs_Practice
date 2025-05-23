import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import useSWR from 'swr';
import axios from 'axios'
import { Post, Sub } from '../types'
import { useAuthState } from '../context/auth'
import useSWRInfinite from 'swr/infinite'
import PostCard from '../components/PostCard'
import { useEffect, useState } from 'react'
const Home: NextPage = () => {
  const {authenticated} = useAuthState();
  const fetcher = async(url: string) => {
    return await axios.get(url).then(res => res.data)
  }
  const address = "/subs/sub/topSubs";

  const getKey = (pageIndex: number, previousPageData: Post[])=>{
    if(previousPageData && ! previousPageData.length) return null;
    return `/posts?page=${pageIndex}`;
  }
  const {data, error, size:page, setSize: setPage, isValidating, mutate} = useSWRInfinite<Post[]>(getKey);
  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];
  const {data: topSubs} = useSWR<Sub[]>(address, fetcher);

  const [observedPost, setObservedPost] = useState("");
  useEffect(() => {
    if(!posts || posts.length === 0) return;
    const id = posts[posts.length -1].identifier;
    if(id !== observedPost){
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  },[posts])
  const observeElement = (element: HTMLElement | null) => {
    if(!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting === true){
          console.log("마지막 포스트입니다.")
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      {threshold:1}
    );
    observer.observe(element);
  }


  return (
    <div className='flex max-w-5xl px-0 pt-5 mx-auto'>
      <div className='hidden w-3/12 mr-4 md:block '>
        <div className='bg-white border rounded '>
          <div className='p-4 border-b'>
          <p className='text-lg font-semibold text-center'>커뮤니티 목록</p>
        </div>

        <div>
          {topSubs?.map((sub)=>(
            <div
            key={sub.name}
            className="flex items-center px-4 py-2 text-xs border-b"
            >
              <Link href={`/r/${sub.name}`}>
                <a>
                  <Image
                    src={sub.imageUrl}
                    className="rounded-full cursor-pointer"
                    alt="Sub"
                    width={24}
                    height={24}
                  />
                </a>
              </Link>
              <Link href={`/r/${sub.name}`}>
                <a className='ml-2 font-semibold hover:cursor-pointer'>
                  {/*/r/*/}{sub.name}
                </a>
              </Link>
              <p className='ml-auto font-md font-bold'>{sub.postCount}</p>
            </div>
          ))}

        </div>
        {authenticated &&
        <div className='w-full py-6 text-center'>
          <Link href="/subs/create">
            <a className='w-full p-2 tex-center text-white bg-gray-400 rounded'>
              커뮤니티 만들기
            </a>
          </Link>
        </div>
        }
      </div>
      
    </div>
      <div className='w-full md:mr-3 md:w-6/12'>
          {isInitialLoading && <p className='text-lg text-center'>Loading...</p>} 
          {posts?.map(post => (
            <PostCard
              key={post.identifier}
              post={post}
              mutate = {mutate}
            />
          ))} 
          
        </div> 
        <div className=' md:w-3/12'>
      <iframe height="430" allow="microphone;" src="https://console.dialogflow.com/api-client/demo/embedded/2100f7b9-313b-4591-b4a8-caa32e42f064"></iframe>
    </div>
    </div>
  )
}

export default Home
