"use client";

import * as React from "react";
import Link from "next/link";
import { auth } from "../app/config/Firebase";
import { useAuth } from "../app/context/AuthContext";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import MenuBtn from "./MenuBtn";
export default function ButtonAppBar() {
  const { signInWithGoogle } = useAuth();
  const [user] = useAuthState(auth);

  return (
    <header className="bg-violet-500 sm:p-4 px-2 py-4">
      <nav className="container mx-auto flex max-w-2xl flex-wrap items-center justify-between ">
        <div className="mr-6 flex flex-shrink-0 items-center text-white">
          <Link href="/">
            <span className="text-xl font-semibold tracking-tight">
              Kibun UP
            </span>
          </Link>
        </div>
        <div className="hidden gap-3 text-sm sm:flex ">
          <Link
            href="/quote"
            className="text-violet-200 hover:text-white lg:mt-0 lg:inline-block"
          >
            Quote
          </Link>
          <Link
            href="/event"
            className="text-violet-200 hover:text-white lg:mt-0 lg:inline-block"
          >
            Event
          </Link>
        </div>
        <div className="hidden items-center justify-between sm:flex">
          {auth.currentUser ? (
            <div>
              <Image
                width={40}
                height={40}
                src={
                  user?.photoURL ? user?.photoURL : "https://placehold.co/50x50"
                }
                alt="profile pic"
              />
              <button
                onClick={() => {
                  signOut(auth);
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                signInWithGoogle();
              }}
              // href="/login"
              className="cursor-pointer text-violet-200 duration-300 hover:text-white lg:mt-0 lg:inline-block"
            >
              Login
            </div>
          )}
        </div>
        <div className="sm:hidden">
          <MenuBtn />
        </div>
        {/* {loginUserInfo?.email && <div>{auth.currentUser?.email}</div>} */}
      </nav>
    </header>
  );
}
