import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'react-bootstrap';

const LandingCarousel = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="carousel-text">
      <Carousel activeIndex={index} onSelect={handleSelect} className="carousel-dark">
        <Carousel.Item>
          <div>
            <h3>Registration:</h3>
            <p>Sign-up by inputting your username and password</p>
          </div>
          <Image src="/images/sign-up.png" fluid />
        </Carousel.Item>
        <Carousel.Item>
          <div>
            <h3>Sign-In:</h3>
            <p>Using your username and password</p>
          </div>
          <Image src="/images/sign-in.png" fluid />
        </Carousel.Item>
        <Carousel.Item>
          <div>
            <h3>Edit Profile:</h3>
            <p>Edit your profile and make changes. </p>
          </div>
          <Image src="/images/edit-profile.png" fluid />
        </Carousel.Item>
        <Carousel.Item>
          <div>
            <h3>Propose A Project</h3>
            <p>Have a great idea for a potential project? Submit it here!</p>
          </div>
          <Image src="/images/add-project.png" fluid />
        </Carousel.Item>
        <Carousel.Item>
          <div>
            <h3>View Potential Projects</h3>
            <p>Want to work on a project, but need an idea? Check out the available projects!</p>
          </div>
          <Image src="/images/single-project.png" fluid />
        </Carousel.Item>
      </Carousel>
    </div>

  );
};

export default LandingCarousel;
