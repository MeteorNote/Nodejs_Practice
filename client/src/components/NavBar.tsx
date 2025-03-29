import axios from "axios";
import Link from "next/link";
import React from "react";
import { useAuthDispatch, useAuthState } from "../context/auth";

const NavBar: React.FC = () =>{
    const {loading, authenticated} = useAuthState();
    const dispatch = useAuthDispatch();
    const handleLogOut = () => {
        axios.post("/auth/logout")
        .then(() => {
            dispatch("LOGOUT");
        })
        .catch((error) => {
            console.log(error);
        })
    }
    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-16 px-5 bg-white">
            <span className="text-2xl font-semibold text-blue-400">
                <Link href="/">Community</Link>
                
            </span>
            
            <div className="flex">
                {!loading && (
                    authenticated ? (
                    <button 
                    className="w-20 p-2 mr-2 text-center text-white bg-red-400 rounded"
                    onClick={handleLogOut}>
                        로그아웃
                    </button>
                ) : (<>
                    <Link href="/login">
                        <a className="w-20 p-2 mr-2 text-center text-white border bg-blue-400 rounded">
                            로그인
                        </a>
                    </Link>
                    <Link href="/register">
                        <a className="w-20 p-2 text-center text-white bg-gray-400 rounded">
                            회원가입
                        </a>
                    </Link>
                </>)

                )}
            </div>
        </div>
    )
}
export default NavBar
