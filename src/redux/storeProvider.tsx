"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppStore, makeStore } from "./store";
import { type Persistor, persistStore } from 'redux-persist';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef= useRef<AppStore>();
  const persistorRef = useRef<Persistor>({} as Persistor);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
  }

  // if (!storeRef.current) {
  //   const store = makeStore();
  //   storeRef.current = store;
  //   console.log(store);

  // }

  return (
    <Provider store={storeRef.current}>
      {/* <PersistGate loading={null} persistor={storeRef.current.__persistor}> */}
      <PersistGate loading={null} persistor={persistorRef.current}>
        {children}
      </PersistGate>
    </Provider>
  );
}
