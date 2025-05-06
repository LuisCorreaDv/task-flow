"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "@/utils/validations";

function MainForm() {
  return (
    // Formik component to handle form state and validation
    // Formik takes initial values, validation schema, and onSubmit function as props
    <Formik
      initialValues={{ email: "", password: "" }}
      //Schema for form validation
      validationSchema={loginSchema}
      onSubmit={(values) => {
        console.log("Form submitted:", values);
        values.email = "";
        values.password = "";
      }}
    >
      {({ errors, touched }) => (
        // Form component to handle form submission
        <Form className="max-w-md mx-auto">
          <div className="relative z-0 w-full mb-5 group">
            {/* Field component for Formkit usage */}
            <Field
              type="email"
              name="email"
              id="floating_email"
              className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-900 focus:outline-none focus:ring-0 focus:border-sky-900 peer ${
                errors.email && touched.email ? "border-red-500" : ""
              }`}
              placeholder=" "
            />
            <label
              htmlFor="floating_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-sky-900 peer-focus:dark:text-sky-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
            {/* Error message component from Formik */}
            <ErrorMessage
              name="email"
              component="span"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div className="relative z-0 w-full mb-5 group">
            {/* Field component for password input */}
            <Field
              type="password"
              name="password"
              id="floating_password"
              className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-sky-900 focus:outline-none focus:ring-0 focus:border-sky-900 peer ${
                errors.password && touched.password ? "border-red-500" : ""
              }`}
              placeholder=" "
            />
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-sky-900 peer-focus:dark:text-sky-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
            {/* Error message component from Formik */}
            <ErrorMessage
              name="password"
              component="span"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <button
            type="submit"
            className="text-white bg-sky-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default MainForm;
