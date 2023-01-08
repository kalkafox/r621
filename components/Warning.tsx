import { animated as a, SpringRef, useSpring, useTrail, useTransition } from "@react-spring/web"

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faCircleCheck,
//   faCircleExclamation,
//   faCircleRadiation,
//   faPaw,
//   faXmark,
// } from "@fortawesome/free-solid-svg-icons"
import { useContext, useEffect, useState } from "react"

//import { faCircleCheck as faRegularCircleCheck } from "@fortawesome/free-regular-svg-icons"

import { poppins } from "../utils/font"

import { Icon } from "@iconify/react"

const icons = {
  circleCheck: "material-symbols:check-circle",
  paw: "mdi:paw",
  xmark: "fa6-solid:xmark",
  circleRadiation: "fa6-solid:circle-radiation",
  circleExclamation: "bi:exclamation-circle",
  regularCircleCheck: "material-symbols:check-circle",
}

const Warning = ({setReady}: {setReady: (ready: boolean) => void}) => {
  const [showWarning, setWarning] = useState(true)
  const [renderWarning, setRenderWarning] = useState(true)
  const [buttonIcon, setButtonIcon] = useState(icons.regularCircleCheck)
  const [warningBoxSpring, warningBoxSpringApi] = useSpring(() => ({
    config: { friction: 20 },
    from: { scale: 0.8, opacity: 0 },
  }))

  const [warningSpring, warningSpringApi] = useSpring(() => ({
    from: { opacity: 1 },
  }))

  const [agreeSpring, agreeSpringApi] = useSpring(() => ({
    config: { friction: 5 },
    from: { scale: 1 },
  }))

  const [disagreeSpring, disagreeSpringApi] = useSpring(() => ({
    config: { friction: 10 },
    from: { scale: 1 },
  }))

  const updateSpring = (springApi: any, modifier: any) => {
    showWarning && springApi.start(modifier)
  }

  useEffect(() => {
    setWarning(window.localStorage.getItem("stop_warning") ? false : true)

    if (!showWarning) {
      window.localStorage.setItem("stop_warning", "true")
      warningBoxSpringApi.start({ config: { friction: 25 }, scale: 0.9 });
      warningSpringApi.start({
        opacity: 0,
        onRest: () => {
          setRenderWarning(false)
        },
      })
      setReady(true)
    } else {
      setRenderWarning(true)
      !window.localStorage.getItem("stop_warning") &&
        warningBoxSpringApi.start({ scale: 1, opacity: 1 })
    }
  }, [showWarning, warningBoxSpringApi, warningSpringApi])

  const acceptTerms = () => {
    setWarning(false)
    setReady(true)
  }

  const buttonTransition = useTransition(buttonIcon, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  return (
    renderWarning ? (
      <a.div
        style={warningSpring}
        className={`z-50 w-full h-full flex fixed justify-center align-center items-center bg-black ${poppins.className}`}>
        <a.div
          style={warningBoxSpring}
          onMouseEnter={() =>
            updateSpring(warningBoxSpringApi, { scale: 1.02 })
          }
          onMouseLeave={() => updateSpring(warningBoxSpringApi, { scale: 1 })}
          className="absolute top-20 text-white bg-slate-800 px-8 py-2 lg:w-10/12 portrait:w-12/12 sm:w-10/12 rounded-2xl text-center w-content break-words font-[Poppins]">
          <div className={`lg:text-6xl sm:text-3xl portrait:text-2xl w-content bg-black portrait:w-full w-4/5 m-auto p-8 rounded-3xl ${poppins.className}`}>
            <Icon className="w-full" icon={icons.circleExclamation} inline={true} /> Hold up a second!
          </div>
          <div className="py-8 lg:text-2xl">
            <p className={`py-8 ${poppins.className}`}>
              This site is explicit by default and as such is considered{" "}
              <b>Not Safe For Work</b> (NSFW)!
              <Icon className="w-full" icon={icons.circleRadiation} inline={true} />
            </p>
            <p className={`py-4 ${poppins.className}`}>
              It makes use of the e621 API to collect random images and display
              them.
            </p>
            <p className={`py-2 ${poppins.className}`}>
              If you agree that you are <b>Over 18</b> and located within a safe
              area to access the content mentioned above, please confirm below.
            </p>
          </div>
          <div className={`portrait:space-x-8 portrait:text-sm lg:space-x-48 sm:space-x-12 md:space-x-8 py-8 text-2xl ${poppins.className}`}>
            <a.button
              style={agreeSpring}
              onMouseEnter={() => {
                updateSpring(agreeSpringApi, { scale: 1.1 });
                setButtonIcon(icons.circleCheck)
              }}
              onMouseLeave={() => {
                updateSpring(agreeSpringApi, { scale: 1 });
                setButtonIcon(icons.regularCircleCheck)
              }}
              onMouseDown={() => {
                updateSpring(agreeSpringApi, { scale: 0.9 });
                setButtonIcon(icons.paw)
              }}
              onMouseUp={() => {
                updateSpring(agreeSpringApi, { scale: 1.1 });
                setButtonIcon(icons.circleCheck)
              }}
              onClick={() => {
                acceptTerms()
              }}
              className="bg-slate-900 p-4 pl-12 rounded-3xl">
              <span className="right-8 relative top-1">
                {buttonTransition((style, i) => (
                  <a.div style={style} className="inline absolute">
                    <Icon inline={true} icon={i} />
                  </a.div>
                ))}
              </span>
              I agree.
            </a.button>
            <a.div
              style={disagreeSpring}
              onMouseEnter={() => {
                updateSpring(disagreeSpringApi, { scale: 1.2 })
              }}
              onMouseLeave={() => {
                updateSpring(disagreeSpringApi, { scale: 1 })
              }}
              onMouseDown={() => {
                updateSpring(disagreeSpringApi, { scale: 0.9 })
              }}
              onMouseUp={() => {
                updateSpring(disagreeSpringApi, { scale: 1.2 })
              }}
              className="inline-block">
              <a
                className="bg-slate-900 p-4 rounded-3xl"
                href="https://google.com">
                <span className="px-2">
                  <Icon className="inline" inline={true} icon={icons.xmark} />
                </span>
                Uh oh, let me out of here!
              </a>
            </a.div>
          </div>
        </a.div>
      </a.div>
    ) : null
  )
}

export default Warning