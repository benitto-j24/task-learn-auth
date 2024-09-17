"use client";
import Signup from "@/Components/Signup";
export default function Home() {
  return (
    <>
      <main className="w-full h-[100vh] flex justify-center bg-bg-image bg-cover bg-center shadow-[inset_0_0_0_600px_rgba(0,0,0,0.5)]">
        <Signup />
      </main>
    </>
  );
}
