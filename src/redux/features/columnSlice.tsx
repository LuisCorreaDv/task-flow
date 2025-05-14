import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Column, Id } from "@/types/TaskTypes";

interface ColumnState {
  columns: Column[];
}

const initialState: ColumnState = {
  columns: [],
};

function generateId() {
  return Math.floor(Math.random() * 10000);
}

const columnSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    reorderColumns: (state, action: PayloadAction<Column[]>) => {
        state.columns = action.payload
    },
    addColumn: (state, action: PayloadAction<string>) => {
      const newColumn: Column = {
        id: generateId(),
        title: action.payload,
      };
      state.columns.push(newColumn);
    },
    updateColumn: (state, action: PayloadAction<{id: Id, title: string}>) => {
        const column = state.columns.find((column) => column.id === action.payload.id)
        if(column) {
            column.title = action.payload.title
        }
    } 
  },
});

export const { addColumn, reorderColumns, updateColumn } = columnSlice.actions;
export default columnSlice.reducer;
