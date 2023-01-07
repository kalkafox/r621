import { trpc } from "../utils/trpc"

import Image from "next/image"
import { useEffect, useState, useRef } from "react"

import BarLoader from "react-spinners/BarLoader"

import { Icon } from "@iconify/react"

import { useSpring, animated as a, useTransition } from "@react-spring/web"

import { resize } from "../utils/helpers"

const buttonData = [
  <Icon key={"mdi:reload"} icon="mdi:reload" />,
  <Icon className="animate-spin" key={"ion:reload-circle"} icon="ion:reload-circle" />,
]

const Index = () => {
  const imageQuery = trpc.e621.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const [loading, setLoading] = useState(false)

  const [imageSpring, setImageSpring] = useSpring(() => ({
    width: 0,
    height: 0,
    scale: 0.8,
    opacity: 0,
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    }
  }))

  const [barLoaderSpring, setBarLoaderSpring] = useSpring(() => ({
    opacity: 0,
    scale: 0.8,
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    }
  }))

  const buttonTransition = useTransition(loading ? buttonData[1] : buttonData[0], {
    from: { opacity: 0, scale: 0.8 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.8 },
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    }
  })

  const imageRef = useRef<HTMLImageElement>(null)


  useEffect(() => {
    const onResize = () => {
      if (window.innerHeight < 300 || window.innerWidth < 500) {
        return
      }

      if (!imageRef.current) {
        return
      }

      const {width, height} = resize(imageQuery.data.posts[0].file.width, imageQuery.data.posts[0].file.height)

      imageRef.current.style.width = `${width}px`
      imageRef.current.style.height = `${height}px`

      imageRef.current.width = width
      imageRef.current.height = height

      setImageSpring.start({width: width, height: height})
    }

    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [imageQuery])

  useEffect(() => {
    if (!imageQuery.data && !imageQuery.data || !imageQuery.data.posts[0] || !imageQuery.data.posts[0].file || !imageQuery.data.posts[0].file.url) {
      return
    }

    switch (imageQuery.data.posts[0].file.ext) {
      case "swf":
        imageQuery.refetch()
        return
      case "mp4":
        imageQuery.refetch()
      case "webm":
        setImageSpring.start({scale: 1, opacity: 1})
        setLoading(false)
    }

    console.log("imageQuery.data.posts[0].file.url", imageQuery.data.posts[0].file.url)

    const {width, height} = resize(imageQuery.data.posts[0].file.width, imageQuery.data.posts[0].file.height)

    if (!imageRef.current) {
      return
    }

    imageRef.current.style.width = `${width}px`
    imageRef.current.style.height = `${height}px`

    imageRef.current.width = width
    imageRef.current.height = height

    setImageSpring.start({width: width, height: height})

  }, [imageQuery.data])

  useEffect(() => {

  })

  return (
    <>
      <div className="w-full h-full bg-zinc-900 fixed">
        {
          buttonTransition((style, item) => (
            <a.button onClick={() => {
              setLoading(true)
              setImageSpring.start({scale: 0.8, opacity: 0, onRest: () => {
                imageQuery.refetch()
              }})
            }} style={style} className="fixed text-zinc-300 bg-zinc-800 p-2 m-2 rounded-xl">
              {item}
            </a.button>
          ))
        }
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-row w-auto h-auto">
            {
              imageQuery.data && imageQuery.data.posts[0] && imageQuery.data.posts[0].file.url && (
                <a.div style={imageSpring}>
                  {imageQuery.data.posts[0].file.ext != "webm" && (
                    <Image className="rounded-xl" alt="lel" onLoad={() => {
                      setImageSpring.start({scale: 1, opacity: 1})
                      setLoading(false)
                    }} ref={imageRef} src={imageQuery.data.posts[0].file.url} width={imageSpring.width.get()} height={imageSpring.height.get()} priority />
                  )}
                  {imageQuery.data.posts[0].file.ext === "webm" && (
                    <video onLoad={() => {
                      setImageSpring.start({scale: 1, opacity: 1})
                      setLoading(false)
                    }} className="rounded-xl" controls={true} autoPlay loop muted>
                      <source src={imageQuery.data.posts[0].file.url} type="video/webm" />
                    </video>
                  )}
                </a.div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
