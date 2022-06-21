import { animated as a, useSpring, useTransition } from "react-spring";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleRadiation,
  faPaw,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";

import { faCircleCheck as faRegularCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { MainContext } from "./Contexts";

const Warning = () => {
  const mainContext = useContext(MainContext);
  const [showWarning, setWarning] = useState(true);
  const [renderWarning, setRenderWarning] = useState(mainContext.loaded);
  const [buttonIcon, setButtonIcon] = useState(faRegularCircleCheck);
  const [warningBoxSpring, warningBoxSpringApi] = useSpring(() => ({
    config: { friction: 10 },
    from: { scale: 0.8, opacity: 0 },
  }));

  const [warningSpring, warningSpringApi] = useSpring(() => ({
    from: { opacity: 1 },
  }));

  const [agreeSpring, agreeSpringApi] = useSpring(() => ({
    config: { friction: 5 },
    from: { scale: 1 },
  }));

  const [disagreeSpring, disagreeSpringApi] = useSpring(() => ({
    config: { friction: 10 },
    from: { scale: 1 },
  }));

  const updateSpring = (springApi, modifier) => {
    showWarning && springApi.start(modifier);
  };

  useEffect(() => {
    mainContext.loaded &&
      setWarning(window.localStorage.getItem("stop_warning") ? false : true);

    if (!showWarning) {
      window.localStorage.setItem("stop_warning", true);
      mainContext.setConfirmed(true);
      warningBoxSpringApi.start({ config: { friction: 25 }, scale: 0.9 });
      warningSpringApi.start({
        opacity: 0,
        onRest: () => setRenderWarning(false),
      });
    } else {
      setRenderWarning(true);
      !window.localStorage.getItem("stop_warning") &&
        mainContext.loaded &&
        warningBoxSpringApi.start({ scale: 1, opacity: 1 });
    }
  }, [mainContext.loaded, showWarning]);

  const acceptTerms = () => {
    setWarning(false);
  };

  const buttonTransition = useTransition(buttonIcon, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    renderWarning && (
      <a.div
        style={warningSpring}
        className="z-50 w-full h-full flex absolute justify-center align-center items-center bg-black">
        <a.div
          style={warningBoxSpring}
          onMouseEnter={() =>
            updateSpring(warningBoxSpringApi, { scale: 1.05 })
          }
          onMouseLeave={() => updateSpring(warningBoxSpringApi, { scale: 1 })}
          className="absolute top-20 text-white bg-slate-800 px-8 py-2 lg:w-10/12 portrait:w-10/12 sm:w-10/12 rounded-2xl text-center w-content break-words font-[Poppins]">
          <div className="lg:text-6xl sm:text-3xl portrait:text-4xl w-content bg-black w-4/5 m-auto p-8 rounded-3xl">
            <FontAwesomeIcon icon={faCircleExclamation} /> Hold up a second!
          </div>
          <div className="py-8 lg:text-2xl">
            <p className="py-8">
              This site is explicit by default and as such is considered{" "}
              <b>Not Safe For Work</b> (NSFW)!{" "}
              <FontAwesomeIcon icon={faCircleRadiation} />
            </p>
            <p className="py-4">
              It makes use of the e621 API to collect random images and display
              them.
            </p>
            <p className="py-2">
              If you agree that you are <b>Over 18</b> and located within a safe
              area to access the content mentioned above, please confirm below.
            </p>
          </div>
          <div className="portrait:space-x-8 lg:space-x-48 sm:space-x-12 md:space-x-8 py-8 text-2xl">
            <a.button
              style={agreeSpring}
              onMouseEnter={() => {
                updateSpring(agreeSpringApi, { scale: 1.2 });
                setButtonIcon(faCircleCheck);
              }}
              onMouseLeave={() => {
                updateSpring(agreeSpringApi, { scale: 1 });
                setButtonIcon(faRegularCircleCheck);
              }}
              onMouseDown={() => {
                updateSpring(agreeSpringApi, { scale: 0.9 });
                setButtonIcon(faPaw);
              }}
              onMouseUp={() => {
                updateSpring(agreeSpringApi, { scale: 1.2 });
                setButtonIcon(faCircleCheck);
              }}
              onClick={() => {
                acceptTerms();
              }}
              className="bg-slate-900 p-4 px-12 rounded-3xl">
              <span className="right-8 relative">
                {buttonTransition((style, i) => (
                  <a.div style={style} className="inline absolute">
                    <FontAwesomeIcon icon={i} />
                  </a.div>
                ))}
              </span>
              I agree.
            </a.button>
            <a.div
              style={disagreeSpring}
              onMouseEnter={() => {
                updateSpring(disagreeSpringApi, { scale: 1.2 });
              }}
              onMouseLeave={() => {
                updateSpring(disagreeSpringApi, { scale: 1 });
              }}
              onMouseDown={() => {
                updateSpring(disagreeSpringApi, { scale: 0.9 });
              }}
              onMouseUp={() => {
                updateSpring(disagreeSpringApi, { scale: 1.2 });
              }}
              className="inline-block">
              <a
                className="bg-slate-900 p-4 rounded-3xl"
                href="https://google.com">
                <span className="px-2">
                  <FontAwesomeIcon icon={faXmark} />
                </span>
                Uh oh, let me out of here!
              </a>
            </a.div>
          </div>
        </a.div>
      </a.div>
    )
  );
};

export default Warning;
