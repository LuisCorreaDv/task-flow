import React from "react";

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
          <form className="max-w-md mx-auto">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="email"
                name="floating_email"
                id="floating_email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-900 focus:outline-none focus:ring-0 focus:border-sky-900 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-sky-900 peer-focus:dark:text-sky-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email address
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="password"
                name="floating_password"
                id="floating_password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-900 focus:outline-none focus:ring-0 focus:border-sky-900 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_password"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-sky-900 peer-focus:dark:text-sky-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
            </div>
            <button
              type="submit"
              className="text-white bg-sky-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default LogIn;
