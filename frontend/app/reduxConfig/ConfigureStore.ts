import { configureStore } from '@reduxjs/toolkit';
import documentCategoriesReducer from './documentCategorie/reducer/documentCategoriesReducer';
import authReducer from './auth/reducer/authReducer';

const store = configureStore({
  reducer: {
    documentCategories: documentCategoriesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
