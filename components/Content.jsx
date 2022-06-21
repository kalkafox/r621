import { useContext, useEffect, useState, useRef } from "react";
import { MainContext } from "./Contexts";
import bgImg from "/public/bg/webb-dark.png";
import { useSpring, useTransition, animated as a } from "react-spring";
import { HexColorPicker } from "react-colorful";
import BackgroundSVG from "./BackgroundSVG";
import reactCSS from "reactcss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPaintbrush,
  faComputerMouse,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { rgbToHex } from "@mui/material";

const updateSpring = (spring, modifier, state = true) => {
  if (!state) {
    return;
  }
  spring.start(modifier);
};

const Content = () => {
  const colorRef = useRef();
  const mainContext = useContext(MainContext);
  const [toggleMouse, setToggleMouse] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [colorEnabled, setColorEnabled] = useState(false);
  const [color, setColor] = useState("#fff");
  const [contentSpring, contentSpringApi] = useSpring(() => ({
    config: {
      friction: 25,
    },
    from: { opacity: 0, scale: 1, x: 0, y: 0 },
  }));

  const [colorWindowSpring, colorWindowSpringApi] = useSpring(() => ({
    config: {
      friction: 10,
    },
    scale: 1,
    opacity: 0,
    y: 30,
    rotateZ: 0,
  }));

  const [colorWindowBlurSpring, colorWindowBlurSpringApi] = useSpring(() => ({
    config: {
      friction: 10,
    },
    scale: 1,
    opacity: 0,
    y: 30,
  }));

  const [colorCircleSpring, colorCircleSpringApi] = useSpring(() => ({
    config: {
      friction: 5,
    },
    scale: 1,
    opacity: 1,
    x: 0,
    rotateZ: 0,
  }));

  const [mouseCircleSpring, mouseCircleSpringApi] = useSpring(() => ({
    config: {
      friction: 5,
    },
    scale: 1,
    opacity: 1,
    x: 0,
    rotateZ: 0,
  }));

  const mouseCircleTransition = useTransition(toggleMouse, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  useEffect(() => {
    mainContext.confirmed &&
      contentSpringApi.start({ opacity: 1, scale: 1.05 });
  }, [mainContext.confirmed]);

  const colorWindowHandler = () => {
    if (!colorOpen) {
      setColorOpen(true);
      updateSpring(colorWindowSpringApi, {
        config: {
          friction: 10,
        },
        y: 0,
        opacity: 0.2,
        onRest: () => setColorEnabled(true),
      });
      updateSpring(colorWindowBlurSpringApi, {
        config: {
          friction: 10,
        },
        y: 0,
        opacity: 1,
      });
      updateSpring(colorCircleSpringApi, {
        config: { friction: 30 },
        scale: 1.4,
        x: 70,
        rotateZ: 90,
      });
    } else {
      setColorEnabled(false);
      updateSpring(colorWindowSpringApi, {
        config: {
          friction: 25,
        },
        y: 30,
        opacity: 0,
        onRest: () => setColorOpen(false),
      });
      updateSpring(colorWindowBlurSpringApi, {
        config: {
          friction: 25,
        },
        y: 30,
        opacity: 0,
      });
      updateSpring(colorCircleSpringApi, {
        config: { friction: 10 },
        scale: 1,
        x: 0,
        rotateZ: 0,
      });
    }
  };

  useEffect(() => {
    const ls = window.localStorage;
    if (!toggleMouse) {
      // TODO: figure out how to get the fucking mouse toggle persistent
      window.localStorage.setItem("toggleMouse", false);
      contentSpringApi.start({ scale: 1.1 });
      setColor(ls.getItem("color", color));
      let x = 0;
      const scalar = 0.05;
      const interval = setInterval(() => {
        x += 1;
        const y = Math.sin(x * scalar);
        console.log(y);
        contentSpringApi.start({ x: y * 8 ** 2, y: y * 20 });
      }, 100);
      return () => clearInterval(interval);
    } else {
      window.localStorage.setItem("toggleMouse", true);
    }
  }, [toggleMouse]);

  useEffect(() => {
    if (color === "#fff") {
      return;
    }
    window.localStorage.setItem("color", color);
  }, [color]);

  const mouseWindowHandler = () => {
    if (!toggleMouse) {
      setToggleMouse(true);
    } else {
      setToggleMouse(false);
    }
  };

  return (
    <>
      <a.div
        style={{
          ...contentSpring,
          boxShadow: `inset 0 0 250px ${color}20`,
          top: "-10%",
          left: "-20%",
        }}
        className={`fixed w-[120%] h-[120%]`}>
        <BackgroundSVG color={color} />
      </a.div>
      {mainContext.confirmed && (
        <div
          onMouseMove={(e) => {
            toggleMouse &&
              updateSpring(contentSpringApi, {
                x: -e.clientX * 0.02,
                y: -e.clientY * 0.02,
              });
          }}
          onMouseEnter={() =>
            toggleMouse && updateSpring(contentSpringApi, { scale: 1.05 })
          }
          onMouseLeave={() =>
            toggleMouse &&
            updateSpring(contentSpringApi, { scale: 1, x: 0, y: 0 })
          }
          className="w-full h-full absolute">
          <div className="absolute bottom-0 mx-12 my-12">
            {colorOpen && (
              <>
                <a.div
                  style={colorWindowBlurSpring}
                  className="backdrop-blur-lg backdrop-saturate-150 w-full h-[12.5rem] rounded-lg absolute my-8"></a.div>
                <a.div
                  className="my-8"
                  style={colorWindowSpring}
                  onMouseEnter={() => {
                    updateSpring(
                      colorWindowSpringApi,
                      { opacity: 1 },
                      colorEnabled
                    );
                  }}
                  onMouseLeave={() => {
                    updateSpring(
                      colorWindowSpringApi,
                      { opacity: 0.2 },
                      colorEnabled
                    );
                  }}>
                  <HexColorPicker
                    style={{
                      pointerEvents: colorEnabled ? "all" : "none",
                    }}
                    onChange={setColor}
                    color={color}
                  />
                </a.div>
              </>
            )}
            <a.button
              onMouseEnter={() =>
                updateSpring(mouseCircleSpringApi, { scale: 1.2 })
              }
              onMouseLeave={() =>
                updateSpring(mouseCircleSpringApi, { scale: 1 })
              }
              style={{ backgroundColor: `${color}20`, ...mouseCircleSpring }}
              onClick={mouseWindowHandler}
              className="rounded-full w-12 h-12 block my-4 backdrop-blur-lg">
              {mouseCircleTransition((style, i) => (
                <a.span
                  style={style}
                  className="grid text-center items-center content-center justify-center h-0">
                  <FontAwesomeIcon
                    color={rgbToHex("rgb(200,200,200)")}
                    icon={i ? faComputerMouse : faClockRotateLeft}
                  />
                </a.span>
              ))}
            </a.button>
            <a.button
              onMouseEnter={() =>
                updateSpring(colorCircleSpringApi, { scale: 1.2 })
              }
              onMouseLeave={() =>
                updateSpring(colorCircleSpringApi, { scale: 1 })
              }
              style={{ backgroundColor: `${color}20`, ...colorCircleSpring }}
              onClick={colorWindowHandler}
              className="rounded-full w-12 h-12 backdrop-blur-lg">
              <FontAwesomeIcon
                color={rgbToHex("rgb(200,200,200)")}
                icon={faPaintbrush}
              />
            </a.button>
          </div>
        </div>
      )}
    </>
  );
};

export default Content;
