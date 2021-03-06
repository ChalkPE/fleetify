import React, { useRef, useEffect, useMemo } from 'react'

const ProfileCanvas = ({ src, onChange, color, ...props }) => {
  const ref = useRef()
  const ctx = useMemo(() => ref.current?.getContext('2d'), [ref.current])

  useEffect(() => {
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => {
      const size = Math.max(400, img.width)
      ctx.canvas.width = ctx.canvas.height = size

      const big = 0.9 // == 360 / 400
      const small = 0.8125 // == 325 / 400

      const center = size / 2
      const bigRadius = (size * big) / 2
      const smallRadius = (size * small) / 2
      const smallStart = (size * (1 - small)) / 2

      // border
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(center, center, center, 0, 2 * Math.PI, false)
      ctx.clip()
      ctx.fillRect(0, 0, size, size)

      // margin w/ border and pic
      ctx.beginPath()
      ctx.arc(center, center, bigRadius, 0, 2 * Math.PI, false)
      ctx.clip()
      ctx.clearRect(0, 0, size, size)

      // scaled pic
      ctx.beginPath()
      ctx.arc(center, center, smallRadius, 0, 2 * Math.PI, false)
      ctx.clip()
      ctx.drawImage(
        img,
        smallStart,
        smallStart,
        smallRadius * 2,
        smallRadius * 2
      )

      if (typeof onChange === 'function') {
        try {
          onChange(ctx.canvas.toDataURL())
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [ref.current, ctx, src, color])

  return <canvas ref={ref} {...props} />
}

export default ProfileCanvas
