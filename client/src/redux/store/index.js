import thunk from "redux-thunk";

import { createStore, applyMiddleware, compose } from "redux";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";

import rootReducer from "../reducers/index";

////////////////////////////////////////////////////////////////////////////////

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = createStore(
//   persistedReducer,
//   composeEnhancers(applyMiddleware(thunk))
// );

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

// const persistor = persistStore(store);
