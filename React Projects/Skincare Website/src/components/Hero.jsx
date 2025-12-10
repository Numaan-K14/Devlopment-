import React, { useLayoutEffect, useRef } from 'react'
import './Hero.css'
import Navbar from './Navbar'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const heroRef = useRef(null)
  const heroImgRef = useRef(null)
  const productsRef = useRef(null)
  const m6Ref = useRef(null)
  const serumRef = useRef(null)
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      setTimeout(() => {
        gsap.to(heroImgRef.current, {
          scrollTrigger: {
            trigger: productsRef.current,
            start: 'top center',
            end: 'top 100px',
            scrub: true,
          },
          x: -10,
          y: 660,
          scale: 0.4,
          rotate: 0,
          ease: 'power2.out',
        })
      }, 1300)
  
      gsap.to(m6Ref.current, {
        scrollTrigger: {
          trigger: serumRef.current, 
          start: 'top bottom',      
          end: 'top center',        
          scrub: true,
        },
        x: 450,   
        y: 500,  
        scale: 1.5,
        rotate:10,
        ease: 'power2.out',
      })
    }, heroRef)
  
    return () => ctx.revert()
  }, [])
  
  

  return (
    <>
      <div className="hero" ref={heroRef}>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Navbar />
        </motion.div>

        <div className="hero-content">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            Minimalist
          </motion.h1>

          <motion.p
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
          >
            <span className="span1">Clean skincare made simple</span>{' '}
            <span className="span2">
              effective, honest, and gentle on your skin.
            </span>
          </motion.p>

          <motion.img
            ref={heroImgRef}
            src="/images/hero.png"
            alt="hero"
            className="hero-img"
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
            style={{ rotate: 20 }}
          />
        </div>

        <motion.div
          className="hero-left"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 1 }}
        >
          <p>
            Discover the power of simplicity in skincare. Formulas designed to
            nourish, balance, and let your natural glow shine. Because true
            beauty begins with healthy, cared-for skin.
          </p>
          <button className="hero-btn">Shop Now</button>
        </motion.div>

        <motion.div
          className="hero-right"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
        >
          <div className="hero-card">
            <h1>Glow Naturally</h1>
            <p>
              Experience minimal skincare crafted to bring balance, hydration,
              and confidence to your everyday routine.
            </p>
            <button className="hero-card-btn">Learn More</button>
          </div>
        </motion.div>
      </div>

      <div className="products" ref={productsRef}>
        <h2>Our Products</h2>
        <div className="product-grid">
          <div className="product-item">
            <div className="product-img">
              <img src="/images/m2.png" alt="product 1" />
            </div>
            <p>Daily Sunscreen</p>
          </div>
          <div className="product-item">
            <div className="product-img">
            </div>
            <p>Hair Serum</p>
          </div>
          <div className="product-item">
            <div className="product-img">
              <img src="/images/m3.png" alt="product 3" />
            </div>
            <p>Face Expholiator</p>
          </div>

          <div className="product-item">
            <div className="product-img">
              <img src="/images/m4.png" alt="product 4" />
            </div>
            <p>Alpha Cleanser</p>
          </div>
          <div className="product-item">
            <div className="product-img">
            <img ref={m6Ref} src="/images/m6.png" alt="product 5" />
            </div>
            <p>Hair Repair Serum</p>
          </div>
          <div className="product-item">
            <div className="product-img">
              <img src="/images/m5.png" alt="product 6" />
            </div>
            <p>Radiance Oil</p>
          </div>
        </div>
      </div>
   <div className="s">
   <div className="serum" ref={serumRef}>

  <div className="serum-text">
    <img src="./images/drop.png" alt="" className='drop' />
    <h1>Hydrating Serum</h1>
    <p>
      Our Hydrating Serum is formulated to deeply nourish and restore your skin’s natural balance. 
      Enriched with essential vitamins and antioxidants, it helps retain moisture, improves elasticity, 
      and gives your skin a dewy, radiant glow. Perfect for daily use and suitable for all skin types — 
      because healthy skin never goes out of style.
    </p>
    <button className="serum-btn">Shop Now</button>
  </div>

  <div className="serum-img">
    <img src="/images/serum.png" alt="Hydrating Serum" />
  </div>
</div>

   </div>
    </>
  )
}

export default Hero
