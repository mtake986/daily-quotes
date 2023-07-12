"use client";
import React, { useEffect, useState } from "react";
import { builtInQuotes } from "../../../public/CONSTANTS";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "@/app/config/Firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { IQuote } from "@/types/type";
import GoogleLoginBtn from "@/components/utils/GoogleLoginBtn";
import { useQuote } from "@/app/context/QuoteContext";
import { BiLock, BiLockOpen, BiRefresh } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Quote = () => {
  const {
    getPrimaryQuote,
    primaryQuotes,
    randomQuote,
    getRandomQuote,
    lockThisQuote,
    lockedQuote,
    removeLockThisQuote,
    getLockedQuote,
  } = useQuote();

  const [loading, setLoading] = useState<boolean>(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    // setLoading(true);
    // getPrimaryQuote();
    getLockedQuote(user?.uid);
    getRandomQuote(setLoading);
    // setLoading(false);
  }, [user]);

  if (loading === true) {
    return (
      <div className="mt-6 flex-col items-center p-12">
        <Skeleton className="h-32 w-full" />
        <span className="mt-4 flex justify-end ">
          <Skeleton className="h-7 w-32" />
        </span>
      </div>
    );
  }
  if (user) {
    if (!randomQuote) {
      return (
        <div className="mt-10 rounded-lg bg-violet-50 p-12 text-center">
          <p>No Quote's to Display</p>
          <Link
            href="/quote"
            className="cursor-pointer text-blue-400 underline duration-300 hover:opacity-70"
          >
            Click here to create an quote
          </Link>
        </div>
      );
    } else if (lockedQuote || randomQuote) {
      return (
        <div className="mt-6 p-12">
          <strong className="text-xl">
            {lockedQuote ? lockedQuote.quote : randomQuote.quote}
          </strong>
          <div className="flex flex-col items-end">
            <div className="mt-4 text-right">
              <span>
                - {lockedQuote ? lockedQuote.person : randomQuote.person}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {lockedQuote ? (
                <Button
                  onClick={() => {
                    alert("To refresh, unlock this quote first.");
                  }}
                  className={`cursor-not-allowed opacity-30 duration-300 hover:bg-slate-50 hover:text-slate-500 sm:w-auto`}
                  variant="ghost"
                >
                  <BiRefresh size={24} />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      getRandomQuote(setLoading);
                      setLoading(false);
                    }, 1000);
                  }}
                  className={` duration-300  hover:bg-blue-50 hover:text-blue-500 sm:w-auto`}
                  variant="ghost"
                >
                  <BiRefresh size={24} />
                </Button>
              )}

              {lockedQuote ? (
                <Button
                  onClick={() => {
                    removeLockThisQuote(user.uid);
                    toast({
                      className: "border-none bg-red-50 text-red-500",
                      title: "Unlocked",
                    });
                  }}
                  className={`text-red-500  duration-300 hover:bg-red-50 hover:text-red-500 sm:w-auto`}
                  variant="ghost"
                >
                  <BiLock size={24} />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    lockThisQuote(user.uid, randomQuote);
                    toast({
                      className: "border-none bg-red-50 text-red-500",
                      title: "Locked",
                    });
                  }}
                  className={`duration-300 hover:bg-red-50 hover:text-red-500 sm:w-auto`}
                  variant="ghost"
                >
                  <BiLockOpen size={24} />
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }
  } else {
    return <GoogleLoginBtn />;
  }
  return <div>Going wrong here</div>;
};

export default Quote;
