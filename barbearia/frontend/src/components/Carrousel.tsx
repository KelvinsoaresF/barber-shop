'use client';

import { useEffect } from 'react';

export default function Carrousel() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <div id="carouselExampleIndicators" className="carousel slide">
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="/imgs/corte.jpg"
            className="d-block w-100"
            alt="First slide"
          />
        </div>
        <div className="carousel-item">
          <img
            src="/imgs/corte.jpg"
            className="d-block w-100"
            alt="Second slide"
          />
        </div>
        <div className="carousel-item">
          <img
            src="/imgs/corte.jpg"
            className="d-block w-100"
            alt="Third slide"
          />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
      <style jsx>{`
        .carousel-item img {
          transition: transform 0.5s ease;
          object-fit: cover;
        }
        .carousel-item-next, .carousel-item-prev, .carousel-item.active {
          transform: none !important;
        }
      `}</style>
    </div>
  );
}
