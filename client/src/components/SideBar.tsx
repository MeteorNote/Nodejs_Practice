import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import { useAuthState } from "../context/auth";
import {Sub} from '../types'
type Props = {
    sub: Sub
}
const SideBar = ({sub}: Props) =>{
    const {authenticated} = useAuthState();
    return (
        <div className="hidden w-4/12 ml-3 md:block">
            <div className="bg-white border rounded">
                <div className="p-3 bg-blue-400 rounded-t">
                    <p className="font-semibold text-white">커뮤니티 설명란</p>
                </div>
                <div className="p-3">
                    <p className="text-small font-bold"> {/*/r/*/}{sub.name}</p>
                    <p className="mb-3 text-base font-bold text-gray-400">{sub?.description}</p>
                    <div className="flex mb-3 text-sm font-medium">
                        <div className="w-1/2">
                        </div>
                    </div>
                    <p className="my-3 font-semibold text-black">
                       <hr className="hrcss mb-4"></hr>
                        <i className="mr-2 fas fa-birthday-cake"></i>
                        커뮤니티 생성 날짜 : {dayjs(sub?.createdAt).format("YYYY.MMM.DD")}
                    </p>
                    {authenticated&& (
                        <div className="mx-0 my-2">
                            <Link href={`/r/${sub.name}/create`}>
                                <a className="w-full p-2 text-sm text-white bg-gray-400 rounded">
                                    포스트 생성
                                </a>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default SideBar