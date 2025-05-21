"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearError, resetVerification, verifyCode, generateVerificationCode } from "@/redux/features/verificationSlice";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";

function VerifyPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { error, verificationPassed, loading } = useAppSelector((state) => state.verification);

  useEffect(() => {
    // Limpiamos el estado anterior y generamos nuevo código
    dispatch(resetVerification());
    dispatch(generateVerificationCode());
  }, [dispatch]);
  
  useEffect(() => {
    if (verificationPassed) {
      router.push("/tasks");
    }
  }, [verificationPassed, router]);

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border-2 border-sky-600 rounded-md shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-sky-800">
        Enter Verification Code
      </h2>

      <Formik
        initialValues={{ code: "" }}
        validate={(values) => {
          const errors: { code?: string } = {};
          if (!values.code) {
            errors.code = "Code is required";
          } else if (!/^\d{6}$/.test(values.code)) {
            errors.code = "Code must be 6 digits";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(clearError())
          dispatch(verifyCode(values.code))
            .unwrap()
            .finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              name="code"
              type="text"
              placeholder="6-digit code"
              className="w-full p-2 border border-sky-700 rounded mb-1"
            />
            <ErrorMessage
              name="code"
              component="div"
              className="text-red-500 text-sm mb-3"
            />

            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-sky-600 text-white p-2 rounded hover:bg-sky-700 transition"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default VerifyPage;
