import Content from "./Content";
import Warning from "./Warning";
import Load from "./Load";

import { MainContext } from "./Contexts";

import { useState } from "react";

const Main = () => {
  const [loaded, setLoaded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [primed, setPrimed] = useState(true);
  const [request, setRequest] = useState(false);

  return (
    <>
      <MainContext.Provider
        value={{
          loaded,
          setLoaded,
          confirmed,
          setConfirmed,
          primed,
          setPrimed,
          request,
          setRequest,
        }}>
        <div className="bg-black fixed -z-[100] w-screen h-screen">
          <Load />
          <Warning />
          <Content />
        </div>
      </MainContext.Provider>
    </>
  );
};

export default Main;
