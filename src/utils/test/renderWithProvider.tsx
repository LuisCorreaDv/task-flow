import { ReactNode } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import verificationReducer from "@/redux/features/verificationSlice";
import authReducer from "@/redux/features/authSlice";
import columnReducer from "@/redux/features/columnSlice";
import taskReducer from "@/redux/features/taskSlice";

const initialStore = configureStore({
  reducer: {
    verification: verificationReducer,
    auth: authReducer,
    columns: columnReducer,
    tasks: taskReducer
  },
});

export function renderWithProvider(component: ReactNode) {
  return render(<Provider store={initialStore}>{component}</Provider>);
}