import { combineReducers, configureStore, Reducer } from "@reduxjs/toolkit";
import { persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import AuthReducer from "./slices/authSlice";
import { PersistPartial } from "redux-persist/lib/persistReducer";


const persistConfig = {
    key: "vibetribe",
    storage: storage,
};

const rootReducer = combineReducers({
    AuthReducer,
});

type RootReducerType = ReturnType<typeof rootReducer>;
type PersistedState = RootReducerType & PersistPartial;

// const makeConfiguredStore = () => configureStore({ reducer: rootReducer });

// interface AppStoreWithPersistor extends ReturnType<typeof configureStore> {
//     persistor?: Persistor;
// }

const persistedReducer: Reducer<PersistedState> = persistReducer(
    persistConfig,
    rootReducer
);

export const makeStore = () => {
    const isServer = typeof window === "undefined";

    const store = configureStore({
        reducer: isServer
            ? rootReducer
            : (persistedReducer as Reducer<RootReducerType | PersistedState>),
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    });

    if (isServer) {
        (store as any).persistor = persistStore(store);
    }

    return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const persistor = persistStore(makeStore());
