import { useContext, useEffect, useState, useRef } from "react";
import { MainContext } from "./Contexts";
import { useSpring, useTransition, animated as a } from "react-spring";
import { HexColorPicker } from "react-colorful";
import BackgroundSVG from "./BackgroundSVG";
import R621Image from "./R621Image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { updateSpring } from "./Util";

import {
  faPaintbrush,
  faComputerMouse,
  faClockRotateLeft,
  faCircle,
  faPencil,
  faArrowRotateRight,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";
import { LinearProgress, rgbToHex } from "@mui/material";
import Notification from "./Notification";

const Color = require("color");

const Content = () => {
  const colorRef = useRef();
  const mainContext = useContext(MainContext);
  const [toggleMouse, setToggleMouse] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);

  const defaultReloadIcons = [faPaw, faArrowRotateRight];

  const [imageReloadIcon, setImageReloadIcon] = useState(defaultReloadIcons[1]);

  const defaultNotification = { text: "", icon: faCircle };

  const [notification, setNotification] = useState(defaultNotification);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationOpened, setNotificationOpened] = useState(false);
  const [colorEnabled, setColorEnabled] = useState(false);
  const [color, setColor] = useState("#000000");
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
    marginTop: 0,
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

  const [imageReloadSpring, imageReloadSpringApi] = useSpring(() => ({
    config: {
      friction: 10,
    },
  }));

  const imageReloadTransition = useTransition(imageReloadIcon, {
    from: { opacity: 0, scale: 0.2, rotateZ: -90 },
    enter: { opacity: 1, scale: 1, rotateZ: 0 },
    leave: { opacity: 0, scale: 0.2, rotateZ: 90 },
  });

  const mouseCircleTransition = useTransition(toggleMouse, {
    from: { opacity: 0, scale: 0.2, rotateZ: -90 },
    enter: { opacity: 1, scale: 1, rotateZ: 0 },
    leave: { opacity: 0, scale: 0.2, rotateZ: 90 },
  });

  const [notificationSpring, notificationSpringApi] = useSpring(() => ({
    reset: true,
    opacity: 0,
    y: 0,
  }));

  const colorApi = Color(color);

  useEffect(() => {
    mainContext.confirmed && toggleMouse
      ? updateSpring(contentSpringApi, { opacity: 1, scale: 1.1 })
      : updateSpring(contentSpringApi, { opacity: 1, scale: 1.3 });
  }, [mainContext.confirmed]);

  useEffect(() => {
    if (notification.text !== "") {
      setNotificationOpened(true);
      updateSpring(notificationSpringApi, {
        from: {
          opacity: 0,
          y: -200,
        },
        to: {
          opacity: 1,
          y: 30,
        },
      });
      const delay = setTimeout(() => {
        updateSpring(notificationSpringApi, {
          from: {
            opacity: 1,
            y: 30,
          },
          to: {
            opacity: 0,
            y: -200,
          },
          onRest: () => setNotificationOpened(false),
        });
      }, 3000);
      return () => clearTimeout(delay);
    }
  }, [notificationOpen, notification]);

  useEffect(() => {
    setNotificationOpen(true);
  }, [notification]);

  const colorWindowHandler = () => {
    if (!colorOpen) {
      setColorOpen(true);
      setColorEnabled(false);
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
        rotateZ: 360,
        marginTop: 250,
      });
    } else {
      window.localStorage.setItem("color", color);
      setNotification({ text: "Color settings saved!", icon: faPencil });
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
        marginTop: 0,
      });
    }
  };

  useEffect(() => {
    const ls = window.localStorage;
    if (!toggleMouse || !ls.getItem("toggleMouse")) {
      contentSpringApi.start({ scale: 1.3 });
      const scalar = 5 * 10 ** -4;
      const interval = setInterval(() => {
        const x = new Date().getTime();
        contentSpringApi.start({
          x: Math.cos(x * scalar) * 8 ** 2,
          y: Math.sin(x * scalar) * 4 ** 2,
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [toggleMouse]);

  useEffect(() => {
    const ls = window.localStorage;
    ls.getItem("toggleMouse") === "true"
      ? setToggleMouse(true)
      : setToggleMouse(false);
    !ls.getItem("color") && ls.setItem("color", "#000000");
    setColor(ls.getItem("color"));
  }, []);

  const mouseWindowHandler = () => {
    if (!toggleMouse) {
      updateSpring(contentSpringApi, { scale: 1.1, x: 0, y: 0 });
      window.localStorage.setItem("toggleMouse", true);
      setToggleMouse(true);
    } else {
      window.localStorage.setItem("toggleMouse", false);
      setToggleMouse(false);
    }
  };

  const buttonStyle = {
    backgroundColor: colorApi.alpha(0.5),
    color:
      colorApi.luminosity() === 1
        ? colorApi.darken(1)
        : colorApi.isDark()
        ? colorApi.lightness(50)
        : colorApi.isLight() && colorApi.darken(0.9),
  };

  const iconStyle = {
    color: colorApi.lightness(80),
  };

  const reloadImageHandler = () => {
    mainContext.setRequest(true);
  };

  useEffect(() => {
    if (mainContext.request) {
      mainContext.setPrimed(false);
    }
  }, [mainContext.request]);

  useEffect(() => {
    if (mainContext.primed) {
      setImageReloadIcon(defaultReloadIcons[0]);
    } else {
      setImageReloadIcon(defaultReloadIcons[1]);
    }
  }, [mainContext.primed]);

  return (
    <>
      <a.div
        style={{
          ...contentSpring,
          boxShadow: `inset 0 0 250px ${color}20`,
          top: "0",
          left: "0",
        }}
        className={`fixed w-screen h-screen`}>
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
          {notificationOpened && (
            <a.div className="fixed w-[800px] z-50" style={notificationSpring}>
              <Notification
                color={color}
                text={notification.text}
                icon={notification.icon}
              />
            </a.div>
          )}
          <R621Image props={{ color, colorApi }} />
          <div className="absolute bottom-0 mx-12 my-12">
            <a.button
              onMouseEnter={() =>
                updateSpring(imageReloadSpringApi, { scale: 1.2 })
              }
              onMouseLeave={() =>
                updateSpring(imageReloadSpringApi, { scale: 1 })
              }
              style={{
                ...imageReloadSpring,
                ...buttonStyle,
                ...iconStyle,
              }}
              disabled={!mainContext.primed}
              onClick={reloadImageHandler}
              className="rounded-full w-12 h-12 block my-4 backdrop-blur-lg">
              {imageReloadTransition((style, i) => (
                <a.span
                  style={style}
                  className={`grid text-center items-center content-center justify-center h-0 ${
                    !mainContext.primed && "fa-spin"
                  }`}>
                  <FontAwesomeIcon icon={i} />
                </a.span>
              ))}
            </a.button>
            <a.button
              onMouseEnter={() =>
                updateSpring(mouseCircleSpringApi, { scale: 1.2 })
              }
              onMouseLeave={() =>
                updateSpring(mouseCircleSpringApi, { scale: 1 })
              }
              style={{
                ...mouseCircleSpring,
                ...buttonStyle,
                ...iconStyle,
              }}
              onClick={mouseWindowHandler}
              className="rounded-full w-12 h-12 block my-4 backdrop-blur-lg">
              {mouseCircleTransition((style, i) => (
                <a.span
                  style={style}
                  className="grid text-center items-center content-center justify-center h-0">
                  <FontAwesomeIcon
                    icon={i ? faComputerMouse : faClockRotateLeft}
                  />
                </a.span>
              ))}
            </a.button>
            {colorOpen && (
              <>
                <a.div
                  style={colorWindowBlurSpring}
                  className="backdrop-blur-lg backdrop-saturate-150 w-full h-[12.5rem] rounded-lg absolute my-8"></a.div>
                <a.div
                  className="my-8 absolute bottom-12"
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
                updateSpring(colorCircleSpringApi, { scale: 1.2 })
              }
              onMouseLeave={() =>
                updateSpring(colorCircleSpringApi, { scale: 1 })
              }
              style={{ ...buttonStyle, ...colorCircleSpring, ...iconStyle }}
              onClick={colorWindowHandler}
              className="rounded-full w-12 h-12 backdrop-blur-lg">
              <FontAwesomeIcon icon={faPaintbrush} />
            </a.button>
          </div>
        </div>
      )}
    </>
  );
};

export default Content;
