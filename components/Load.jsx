import { animated as a, useSpring } from "react-spring";
import { useContext, useState, useEffect } from "react";
import { CircularProgress, Backdrop, LinearProgress } from "@mui/material";
import { MainContext } from "./Contexts";

const Load = () => {
  const mainContext = useContext(MainContext);
  const [circularSpring, circularSpringApi] = useSpring(() => ({
    config: { friction: 10 },
    scale: 1,
    opacity: 1,
  }));

  useEffect(() => {
    const onPageLoad = () => {
      mainContext.setLoaded(true);
      if (mainContext.loaded) {
        circularSpringApi.start({
          config: {
            friction: 20,
          },
          opacity: 0,
          scale: 0.8,
        });
      }
      // context here
    };

    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
      return () => {
        window.removeEventListener("load", onPageLoad);
      };
    }
  }, []);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={!mainContext.loaded}>
      <a.div style={circularSpring}>
        <span className="absolute text-6xl mx-14 my-16">🦊</span>
        <CircularProgress
          sx={{ color: "#e25a4833" }}
          size={200}
          className="rounded-3xl"
        />
      </a.div>
    </Backdrop>
  );
};

export default Load;
