import { trpc } from '../utils/trpc'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

import BarLoader from 'react-spinners/BarLoader'

import { Icon } from '@iconify/react'

import { useForm } from 'react-hook-form'

import {
  useSpring,
  animated as a,
  useTransition,
  useTrail,
} from '@react-spring/web'

import { resize } from '../utils/helpers'

import { poppins } from '../utils/font'

import Warning from '../components/Warning'
import { useRouter } from 'next/router'

const buttonData = [
  <Icon key={'mdi:reload'} icon="mdi:reload" />,
  <Icon
    className="animate-spin"
    key={'ion:reload-circle'}
    icon="ion:reload-circle"
  />,
]

const Index = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [tags, setTags] = useState<string>('')
  const [tagsInput, setTagsInput] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const [ready, setReady] = useState(false)

  const router = useRouter()

  const imageQuery = trpc.e621.useQuery(tags, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const [imageSpring, setImageSpring] = useSpring(() => ({
    width: 0,
    height: 0,
    scale: 0.8,
    opacity: 0,
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    },
  }))

  const [barLoaderSpring, setBarLoaderSpring] = useSpring(() => ({
    opacity: 0,
    scale: 0.8,
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    },
  }))

  const buttonTransition = useTransition(
    loading ? buttonData[1] : buttonData[0],
    {
      from: { opacity: 0, scale: 0.8 },
      enter: { opacity: 1, scale: 1 },
      leave: { opacity: 0, scale: 0.8 },
      config: {
        mass: 1,
        tension: 170,
        friction: 26,
      },
    },
  )

  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const imageInfoTrail = useTrail(3, {
    config: { mass: 1, tension: 170, friction: 26 },
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
  })

  useEffect(() => {
    const onResize = () => {
      if (window.innerHeight < 300 || window.innerWidth < 500) {
        return
      }

      const { width, height } = resize(
        imageQuery.data.posts[0].file.width,
        imageQuery.data.posts[0].file.height,
      )

      if (imageRef.current) {
        imageRef.current.style.width = `${width}px`
        imageRef.current.style.height = `${height}px`

        imageRef.current.width = width
        imageRef.current.height = height
      } else if (videoRef.current) {
        videoRef.current.style.width = `${width}px`
        videoRef.current.style.height = `${height}px`

        videoRef.current.width = width
        videoRef.current.height = height
      }

      setImageSpring.start({ width: width, height: height })
    }

    const timeout = setTimeout(() => {
      if (
        imageQuery.data &&
        imageQuery.data.posts[0] &&
        imageQuery.data.posts[0].file &&
        !imageQuery.data.posts[0].file.url
      ) {
        imageQuery.refetch()
      }

      if (imageQuery.data && !imageQuery.data.posts[0]) {
        alert('No image found. Please retry the search.')
        setTagsInput('')
        setTags('')
      }
    }, 1000)

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timeout)
    }
  }, [imageQuery, setImageSpring])

  useEffect(() => {
    if (
      (!imageQuery.data && !imageQuery.data) ||
      !imageQuery.data.posts[0] ||
      !imageQuery.data.posts[0].file ||
      !imageQuery.data.posts[0].file.url
    ) {
      return
    }

    if (imageQuery.data.posts[0].file.url == null) {
      imageQuery.refetch()
      return
    }

    switch (imageQuery.data.posts[0].file.ext) {
      case 'swf':
        imageQuery.refetch()
        return
      case 'mp4':
        imageQuery.refetch()
      case 'webm':
        setImageSpring.start({ scale: 1, opacity: 1 })
        setLoading(false)
        if (videoRef.current) {
          videoRef.current.src = imageQuery.data.posts[0].file.url
          videoRef.current.play()
        }
    }

    console.log(
      'imageQuery.data.posts[0].file.url',
      imageQuery.data.posts[0].file.url,
    )

    const { width, height } = resize(
      imageQuery.data.posts[0].file.width,
      imageQuery.data.posts[0].file.height,
    )

    if (imageRef.current) {
      imageRef.current.style.width = `${width}px`
      imageRef.current.style.height = `${height}px`

      imageRef.current.width = width
      imageRef.current.height = height
    } else if (videoRef.current) {
      videoRef.current.style.width = `${width}px`
      videoRef.current.style.height = `${height}px`

      videoRef.current.width = width
      videoRef.current.height = height
    }

    setImageSpring.start({ width: width, height: height })
  }, [imageQuery.data])

  useEffect(() => {
    const { tags } = router.query

    if (window.localStorage.getItem('tags') != null) {
      console.log(tags)
      setTagsInput(window.localStorage.getItem('tags') || '')
      setTags(window.localStorage.getItem('tags') || '')
      if (inputRef.current) {
        inputRef.current.value = window.localStorage.getItem('tags') || ''
      }
    }

    if (tags) {
      setTags(tags as string)
      setTagsInput(tags as string)
      if (inputRef.current) {
        inputRef.current.value = tags as string
      }
    }
  }, [router.query])

  const onSubmit = (data: any) => {
    window.localStorage.setItem('tags', tagsInput)
    setLoading(true)
    setImageSpring.start({
      scale: 0.8,
      opacity: 0,
      onRest: () => {
        setTags(tagsInput)
        imageQuery.refetch()
      },
    })
  }

  return (
    <>
      {ready && (
        <div className="w-full h-full bg-zinc-900 fixed">
          <div
            className={`bottom-0 fixed m-2 text-zinc-300 ${poppins.className}`}
          >
            Powered by{' '}
            <svg
              className="w-20 inline"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 394 80"
            >
              <path
                fill="#fef"
                d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"
              />
              <path
                fill="#fef"
                d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"
              />
            </svg>
          </div>
          {loading && (
            <div className="fixed w-full flex flex-col items-center justify-center h-full">
              <BarLoader
                color="#F59E0B"
                loading={loading}
                width={500}
                height={4}
              />
            </div>
          )}
          {buttonTransition((style, item) => (
            <a.button
              onClick={() => {
                setLoading(true)
                setImageSpring.start({
                  scale: 0.8,
                  opacity: 0,
                  onRest: () => {
                    imageQuery.refetch()
                  },
                })
              }}
              style={style}
              className="fixed text-zinc-300 bg-zinc-800 p-2 m-2 rounded-xl"
            >
              {item}
            </a.button>
          ))}
          <div className="m-2 fixed top-10">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <input
                {...register('tags', { required: true })}
                value={tagsInput}
                onChange={e => {
                  setTagsInput(e.target.value)
                }}
                className={`bg-zinc-800 text-zinc-300 rounded-xl p-2 m-2 ${poppins.className}`}
                type="text"
                placeholder="Tags"
              />
            </form>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-row w-auto h-auto">
              {imageQuery.data &&
                imageQuery.data.posts[0] &&
                imageQuery.data.posts[0].file.url && (
                  <a.div style={imageSpring}>
                    <a
                      href={`https://e621.net/posts/${imageQuery.data.posts[0].id}`}
                    >
                      {imageQuery.data.posts[0].file.ext !== 'webm' && (
                        <Image
                          className="rounded-xl"
                          alt="lel"
                          onLoad={() => {
                            setImageSpring.start({ scale: 1, opacity: 1 })
                            setLoading(false)
                          }}
                          ref={imageRef}
                          src={imageQuery.data.posts[0].file.url}
                          width={imageSpring.width.get()}
                          height={imageSpring.height.get()}
                          priority
                        />
                      )}
                      {imageQuery.data.posts[0].file.ext === 'webm' && (
                        <video
                          ref={videoRef}
                          onLoad={() => {
                            setImageSpring.start({ scale: 1, opacity: 1 })
                            setLoading(false)
                          }}
                          className="rounded-xl"
                          controls={true}
                          autoPlay
                          loop
                          muted
                        >
                          <source
                            src={imageQuery.data.posts[0].file.url}
                            type="video/webm"
                          />
                        </video>
                      )}
                    </a>
                  </a.div>
                )}
            </div>
          </div>
        </div>
      )}
      <Warning setReady={setReady} />
    </>
  )
}

export default Index
