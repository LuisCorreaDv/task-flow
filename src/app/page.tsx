import React from "react";
import LoginForm from "@/components/MainForm";
import Footer from "@/components/Footer";

function LogIn() {
  return (
    <>
      {/* Page Header */}
      <header className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-16">
        <h1 className="text-center text-8xl font-semibold bg-gradient-to-r from-cyan-300 to-sky-800 bg-clip-text text-transparent">
          Task Flow
        </h1>
        <p className="text-center text-lg font-semibold leading-6 text-gray-600 dark:text-gray-200">
          A modern web platform for task management featuring secure
          authentication, a Trello-style Kanban board, and real-time updates.
        </p>
      </header>

      {/* Page Content */}
      <main>
        <section className="shadow-lg bg-[#f8fbff] dark:bg-gray-800 rounded-lg max-w-md mx-auto p-6 opacity-90">
          <h3 className=" text-2xl font-bold text-sky-900 pb-8">Log In</h3>
          <LoginForm />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default LogIn;
