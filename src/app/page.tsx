import React from "react";

function LogIn() {
  return (
    <>
      <header className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-16">
        <h1 className="text-center text-8xl font-semibold bg-gradient-to-r from-cyan-300 to-sky-800 bg-clip-text text-transparent">
          Task Flow
        </h1>
        <p className="text-center text-lg font-semibold leading-6 text-gray-600 dark:text-gray-200">
          A modern web platform for task management featuring secure
          authentication, a Trello-style Kanban board, and real-time updates.
        </p>
      </header>
    </>
  );
}

export default LogIn;
