import Content from "./Content";
import Warning from "./Warning";
import Load from "./Load";

import { MainContext } from "./Contexts";

import { useState } from "react";

const Main = () => {
  const [loaded, setLoaded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <>
      <MainContext.Provider
        value={{ loaded, setLoaded, confirmed, setConfirmed }}>
        <div className="bg-black w-full h-full absolute -z-[100]">
          <Load />
          <Warning />
          <Content />
        </div>
      </MainContext.Provider>
    </>
  );
};

export default Main;
