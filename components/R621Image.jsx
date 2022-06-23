import { useState, useEffect, useContext } from "react";
import Load from "./Load";

import Image from "next/image";

import { animated as a, useSpring } from "react-spring";

import { CircularProgress } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { updateSpring } from "./Util";

const Color = require("color");

import { MainContext } from "./Contexts";
const R621Image = (data) => {
  const mainContext = useContext(MainContext);
  const color = Color(data.props.color);
  const [tags, setTags] = useState(["m/m", "-intersex", "-female"]);
  const [loaded, setLoaded] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [fired, setFired] = useState(false);
  const [documentSize, setDocumentSize] = useState({ width: 1, height: 1 });
  const [ratio, setRatio] = useState({ width: 0, height: 0 });
  const [image, setImage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [circularSpring, circularSpringApi] = useSpring(() => ({
    config: { friction: 10 },
    scale: 0.8,
    opacity: 0,
    rotateZ: -90,
  }));

  const [imageSpring, imageSpringApi] = useSpring(() => ({
    config: { friction: 10 },
    scale: 0.8,
    opacity: 0,
  }));

  const fetchImage = async () => {
    let response = await fetch("api/image", {
      headers: { Tags: tags.join("+") },
    });
    if (response.status === 200) {
      let data = await response.json();
      while (data === null) {
        response = await fetch("api/image", {
          headers: { Tags: tags.join("+") },
        });

        data = await response.json();
        break;
      }
      setImage(data);
      setProgress(50);
      console.log("ayo");
      console.log(data);
      setLoaded(true);
      setFired(false);
    } else {
      setProgress(50);
    }
  };

  useEffect(() => {
    const load = () => {
      console.log("yote");
    };
    window.addEventListener("load", load);
    return () => window.removeEventListener("load", load);
  }, []);

  useEffect(() => {
    if (loaded) {
      setDocumentSize({
        width: window.innerWidth,
        height: window.innerHeight * 0.8,
      });
      const onResize = () => {
        setDocumentSize({
          width: window.innerWidth,
          height: window.innerHeight * 0.8,
        });
      };

      setImageReady(true);

      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      const imageRatio = Math.min(
        documentSize.width / image.image_data.file.width,
        documentSize.height / image.image_data.file.height
      );
      setRatio({
        width: image.image_data.file.width * imageRatio,
        height: image.image_data.file.height * imageRatio,
      });
    }
  }, [documentSize, loaded]);

  useEffect(() => {
    console.log(ratio);
  }, [ratio]);

  useEffect(() => {
    if (mainContext.primed || mainContext.request) {
      mainContext.setRequest(false);
      setLoaded(false);
      setProgress(0);
      updateSpring(circularSpringApi, { scale: 1, opacity: 1, rotateZ: 0 });
      updateSpring(imageSpringApi, {
        scale: 0.8,
        opacity: 0,
        onRest: () => setImageReady(false),
      });
      fetchImage();
    }
  }, [mainContext.request]);

  const loadHandler = () => {
    if (fired) {
      console.log("we loaded!");
      setProgress(100);
      setFired(false);
    }
    setFired(true);
  };

  useEffect(() => {
    progress === 100 &&
      imageSpringApi.start({ scale: 1, opacity: 1 }) &&
      setTimeout(() => {
        circularSpringApi.start({
          config: { friction: 25 },
          scale: 0.8,
          opacity: 0,
          rotateZ: 90,
          onRest: () => {
            mainContext.setPrimed(true);
            console.log("good to go");
            circularSpringApi.start({
              config: { friction: 10 },
              rotateZ: -90,
            });
          },
        });
      }, 2000);
  }, [progress]);

  useEffect(() => {
    if (loaded && fired) {
      const interval = setInterval(() => {
        setProgress((progress) => {
          if (progress < 90) {
            return progress + 0.5;
          } else {
            return progress;
          }
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loaded, fired]);

  return (
    <>
      <div>
        <div className="absolute mx-24">
          <a.span className="top-20 absolute" style={circularSpring}>
            <span
              style={{
                color: (color.luminosity() === 1
                  ? color.darken(1)
                  : color.isDark()
                  ? color.lightness(50)
                  : color.isLight() && color.darken(0.9)
                )
                  .alpha(0.5)
                  .hex(),
              }}
              className="absolute text-6xl mx-[4.4rem] my-16">
              <FontAwesomeIcon icon={faPaw} />
            </span>
            <CircularProgress
              sx={{
                color: (color.luminosity() === 1
                  ? color.darken(1)
                  : color.isDark()
                  ? color.lightness(50)
                  : color.isLight() && color.darken(0.9)
                ).hex(),
              }}
              value={progress}
              variant={progress >= 50 ? "determinate" : "indeterminate"}
              size={200}
              className="rounded-3xl"
            />
          </a.span>
        </div>
      </div>
      {(imageReady || loaded) && (
        <a.div
          className="fixed m-auto left-0 right-0 top-20"
          onMouseEnter={() => updateSpring(imageSpringApi, { scale: 1.1 })}
          onLoad={() => loadHandler()}
          style={{
            width: ratio.width,
            height: ratio.height,
            ...imageSpring,
          }}>
          <Image
            src={`${image.image_data.file.url}`}
            width={image.image_data.file.width}
            height={image.image_data.file.height}
            layout="responsive"
            alt="ponr"
          />
        </a.div>
      )}
    </>
  );
};

export default R621Image;
