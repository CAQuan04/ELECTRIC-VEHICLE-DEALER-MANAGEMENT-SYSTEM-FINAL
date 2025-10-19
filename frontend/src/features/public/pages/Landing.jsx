 import React, { useState, useEffect, useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { AuthComponent } from '@modules/auth';
import { Header, Footer } from '@modules/layout';
import PropTypes from 'prop-types';
import BezierEasing from 'bezier-easing';
import './Landing.css';



function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const 
  modelSImg = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Hero-Desktop-US.png",
  modelYImg = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-2-Hero-Desktop.jpg",
  modelXImg = "https://static1.pocketlintimages.com/wordpress/wp-content/uploads/2024/05/tesla-model-x.jpg",
  cyphertruckImg = "https://cdn.magzter.com/1406567956/1701902482/articles/l3D7l_ggN1702027544376/TESLAS-DISRUPTIVE-BREAKTHROUGH-PRESE-FOR-THE-PICKUP-INDUSTRY.jpg",
  model3Img = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Exterior-Hero-Desktop-LHD.jpg";

const slides = [
  {
    id: 1,
    name: "Model S",
    desc: "Experience pure electric speed with unmatched luxury and elegance ",
    color: "#e21414fa",
    imgFloorUrl: modelSImg,
    imgUrl: modelSImg,
    topSpeed: 155
    ,
    mph: 3.1,
    mileRange: 410,
    bckgHeight: 300,
    carShadowHeight: 300,
    shadowOpacity: 0.2,
  },
  {
    id: 2,
    name: "Model X",
    desc: "The electric car that makes innovation simple, modern, and accessible to everyone.",
    color: "#080181cd",
    imgFloorUrl: modelXImg,
    imgUrl: modelXImg,
    topSpeed: 163,
    mph: 2.5,
    mileRange:  352,
    bckgHeight: 250,
    carShadowHeight: 0,
    shadowOpacity: 0.5,
  },
  {
    id: 3,
    name: "Model 3",
    desc: "Open the wings of tomorrow and drive into the future with style and power. ",
    color: "#61068ecb",
    imgFloorUrl: model3Img,
    imgUrl: model3Img,
    topSpeed: 155,
    mph: 4.2,
    mileRange: 346,
    bckgHeight: 300,
    carShadowHeight: 250,
    shadowOpacity: 0.2,
  },
  {
    id: 4,
    name: "Model Y",
    desc: "Designed for every journey – versatile, practical, and ready for your lifestyle.",
    color: "#d9d9d9ff",
    imgFloorUrl: modelYImg,
    imgUrl: modelYImg,
    topSpeed: 124.9,
    mph: 3.6,
    mileRange: 357,
    bckgHeight: 340,
    carShadowHeight: 150,
    shadowOpacity: 0.5,
  },
  {
    id: 5,
    name: "Cybertruck",
    desc: "Forged in steel, built for strength, and made to break every limit.",
    color: "#5d5d5dff",
    imgFloorUrl: cyphertruckImg,
    imgUrl: cyphertruckImg,
    topSpeed: 65,
    mph: 5,
    mileRange: 500,
    bckgHeight: 390,
    carShadowHeight: 400,
    shadowOpacity: 0.2,
  },
];

class SetCSSVariables extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.cssVariables !== prevProps.cssVariables) {
      Object.keys(this.props.cssVariables).forEach((key) => {
        document.documentElement.style.setProperty(key, this.props.cssVariables[key]);
      });
    }
  }

  render() {
    return this.props.children;
  }
}

SetCSSVariables.propTypes = {
  cssVariables: PropTypes.object.isRequired,
  children: PropTypes.node,
};

function SlideAside(props) {
  const activeCar = props.activeCar;
  return (
    <div className="tesla-slide-aside">
      <h1 className="tesla-slide-aside__wholename">
        <span>Tesla</span>
        <TransitionGroup
          component="span"
          className="tesla-slide-aside__name"
        >
          <CSSTransition
            key={activeCar.name}
            timeout={{ enter: 800, exit: 1000 }}
            className="tesla-slide-aside__name-part"
            classNames="tesla-slide-aside__name-part-"
            mountOnEnter={true}
            unmountOnExit={true}
          >
            <span>{activeCar.name}</span>
          </CSSTransition>
        </TransitionGroup>
      </h1>
      <TransitionGroup className="tesla-slide-aside__desc">
        <CSSTransition
          key={activeCar.desc}
          timeout={{ enter: 900, exit: 1200 }}
          className="tesla-slide-aside__desc-text"
          classNames="tesla-slide-aside__desc-text-"
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <p>{activeCar.desc}</p>
        </CSSTransition>
      </TransitionGroup>
      <div className="tesla-slide-aside__button">
        <a href='/catalog'>
          <button className="button" style={{ backgroundColor: activeCar.color }}>Reserve now</button>
        </a>
        <TransitionGroup>
          <CSSTransition
            key={activeCar.color}
            timeout={{ enter: 800, exit: 1000 }}
            mountOnEnter={true}
            unmountOnExit={true}
            classNames="button__border-"
          >
            <SetCSSVariables cssVariables={{ "--btn-color": activeCar.color }}>
              <span className="button__border" />
            </SetCSSVariables>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
}

SlideAside.propTypes = {
  activeCar: PropTypes.object.isRequired,
};

function animate(render, duration, easing, next = () => null) {
  const start = Date.now();
  (function loop() {
    const current = Date.now(),
      delta = current - start,
      step = delta / duration;
    if (step > 1) {
      render(1);
      next();
    } else {
      requestAnimationFrame(loop);
      render(easing(step * 2));
    }
  })();
}

const myEasing = BezierEasing(0.4, -0.7, 0.1, 1.5);

class AnimValue extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "node", null);
    _defineProperty(this, "timeout", null);
    _defineProperty(this, "setValue", (value, step) => {
      if (!this.node) return;
      this.node.style.opacity = step === 1 ? 1 : 0.7;
      this.node.innerHTML = value;
    });
  }

  animate(previousValue, newValue, applyFn) {
    window.clearTimeout(this.timeout);
    const diff = newValue - previousValue;
    const renderFunction = (step) => {
      this.timeout = setTimeout(() => {
        applyFn(
          this.props.transformFn(previousValue + diff * step, step),
          step
        );
      }, this.props.delay);
    };
    animate(renderFunction, this.props.duration, myEasing);
  }

  componentDidMount() {
    this.animate(0, this.props.value, this.setValue);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.animate(prevProps.value, this.props.value, this.setValue);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
    this.timeout = null;
  }

  render() {
    return (
      <span
        className={this.props.className}
        ref={(node) => (this.node = node)}
      >
        0
      </span>
    );
  }
}
_defineProperty(AnimValue, "defaultProps", {
  delay: 0,
  duration: 800,
  transformFn: (value) => Math.floor(value),
});

AnimValue.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
  delay: PropTypes.number,
  duration: PropTypes.number,
  transformFn: PropTypes.func,
};

class AnimateValue extends React.Component {
  render() {
    return (
      <AnimValue
        className={this.props.className}
        delay={this.props.delay}
        value={this.props.value}
        transformFn={(value, step) =>
          step === 1
            ? value % 1 !== 0
              ? value.toFixed(1)
              : value
            : Math.abs(Math.floor(value))
        }
      />
    );
  }
}

AnimateValue.propTypes = {
  className: PropTypes.string,
  delay: PropTypes.number,
  value: PropTypes.number.isRequired,
};

let DELAY_TOP_SPEED = 200;
let DELAY_MPH = 700;
let DELAY_MILE_RANG = 1200;

class SlideParams extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.animationForward !== this.props.animationForward) {
      if (!this.props.animationForward) {
        DELAY_TOP_SPEED = 1200;
        DELAY_MILE_RANG = 200;
      } else {
        DELAY_TOP_SPEED = 200;
        DELAY_MILE_RANG = 1200;
      }
    }
  }

  render() {
    const { activeCar } = this.props;

    return (
      <div className="tesla-slide-params">
        <ul className="tesla-slide-params__list">
          <li className="tesla-slide-params__item">
            <div className="tesla-slide-params__wrapper">
              <span className="tesla-slide-params__prefix">+</span>
              <AnimateValue
                className="tesla-slide-params__value"
                value={activeCar.topSpeed}
                delay={DELAY_TOP_SPEED}
              />
              <span className="tesla-slide-params__sufix">mph</span>
            </div>
            <p className="tesla-slide-params__name">Top speed</p>
          </li>
          <li className="tesla-slide-params__item">
            <div className="tesla-slide-params__wrapper">
              <AnimateValue
                className="tesla-slide-params__value"
                value={activeCar.mph}
                delay={DELAY_MPH}
              />
              <span className="tesla-slide-params__sufix">s</span>
            </div>
            <p className="tesla-slide-params__name">0-60 mph</p>
          </li>
          <li className="tesla-slide-params__item">
            <div className="tesla-slide-params__wrapper">
              <AnimateValue
                className="tesla-slide-params__value"
                value={activeCar.mileRange}
                delay={DELAY_MILE_RANG}
              />
              <span className="tesla-slide-params__sufix">mi</span>
            </div>
            <p className="tesla-slide-params__name">Mile Range</p>
          </li>
        </ul>
      </div>
    );
  }
}

SlideParams.propTypes = {
  activeCar: PropTypes.object.isRequired,
  animationForward: PropTypes.bool.isRequired,
};

class Slide extends React.Component {
  render() {
    const { activeSlide, animationForward, setAnimationState, ANIMATION_PHASES } = this.props;

    return (
      <div className={`tesla-slide ${animationForward ? "animation-forward" : "animation-back"}`}>
        <SlideAside activeCar={activeSlide} />
        <TransitionGroup>
          <CSSTransition
            key={activeSlide.name}
            timeout={{ enter: 800, exit: 1000 }}
            classNames="tesla-slide__bckg-"
            mountOnEnter={true}
            unmountOnExit={true}
          >
            <SetCSSVariables
              cssVariables={{
                "--car-color": activeSlide.color,
                "--bckg-height": activeSlide.bckgHeight + "px",
                "--shadow-opacity": activeSlide.shadowOpacity,
                "--car-shadow-height": activeSlide.carShadowHeight + "px",
              }}
            >
              <div className="tesla-slide__bckg">
                <div className="tesla-slide__bckg-fill" />
              </div>
            </SetCSSVariables>
          </CSSTransition>
        </TransitionGroup>
        <TransitionGroup>
          <CSSTransition
            key={activeSlide.name}
            timeout={{ enter: 700, exit: 1200 }}
            classNames="tesla-slide__img-"
            mountOnEnter={true}
            unmountOnExit={true}
            onEntered={() => setAnimationState(ANIMATION_PHASES.STOP)}
          >
            <div className="tesla-slide__img">
              <img
                className="tesla-slide__img-floor"
                src={activeSlide.imgFloorUrl}
                alt=""
              />
              <img
                className="tesla-slide__img-car"
                src={activeSlide.imgUrl}
                alt=""
              />
            </div>
          </CSSTransition>
        </TransitionGroup>
        <SlideParams activeCar={activeSlide} animationForward={animationForward} />
      </div>
    );
  }
}

Slide.propTypes = {
  activeSlide: PropTypes.object.isRequired,
  animationForward: PropTypes.bool.isRequired,
  setAnimationState: PropTypes.func.isRequired,
  ANIMATION_PHASES: PropTypes.object.isRequired,
};

function SliderNavigation(props) {
  return (
    <div className="tesla-slider-navigation">
      <ul className="tesla-slider-navigation__list">
        {props.carsNames.map((car) => (
          <li key={car.id} className="tesla-slider-navigation__item">
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                props.setActiveSlide(props.carsNames.indexOf(car));
              }}
              className={`tesla-slider-navigation__link ${
                props.carsNames[props.activeSlide] === car
                  ? "tesla-slider-navigation__link--active"
                  : ""
              }`}
              style={{
                color:
                  props.carsNames[props.activeSlide] === car ? car.color : "#f1f1f1",
              }}
            >
              {car.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

SliderNavigation.propTypes = {
  setActiveSlide: PropTypes.func.isRequired,
  carsNames: PropTypes.array.isRequired,
  activeSlide: PropTypes.number.isRequired,
};

const logoTesla =
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/logoTesla.svg",
  mouseImg = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/mouse.svg",
  hamburger =
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/hamburger.svg";

const ANIMATION_PHASES = {
  PENDING: "PENDING",
  STOP: "STOP",
};

class Slider extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "state", {
      activeSlide: 0,
      animationForward: true,
      slidesCount: slides.length,
      animationState: null,
      showScrollHint: false,
    });
    _defineProperty(this, "slider", { header: "", content: "" });
    _defineProperty(this, "setAnimationState", (animationState) => this.setState({ animationState }));
    _defineProperty(this, "setActiveSlide", (slideId) => {
      this.setState({
        activeSlide: slideId,
        animationForward: this.state.activeSlide < slideId,
        animationState: ANIMATION_PHASES.PENDING,
      });
    });
    _defineProperty(this, "timeout", null);
    _defineProperty(this, "handleWindowScroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const sliderElement = document.querySelector('.tesla-slider');
      
      // If user scrolled back up to slider area and wheel listener is not active
      if (scrollTop <= (sliderElement ? sliderElement.offsetHeight : window.innerHeight)) {
        // Re-enable wheel listener for slider navigation
        if (!this._wheelListenerActive) {
          document.body.addEventListener("wheel", this.handleScroll);
          this._wheelListenerActive = true;
        }
      }
    });
    _defineProperty(this, "handleScroll", (e) => {
      e.preventDefault();
      window.clearTimeout(this.timeout);
      
      this.timeout = setTimeout(() => {
        // Scroll up logic - navigate to previous slide
        if (e.deltaY < 0 && this.state.activeSlide !== 0) {
          this.setActiveSlide(this.state.activeSlide - 1);
        }
        
        // Scroll down logic
        if (e.deltaY > 0) {
          // If not at the last slide, go to next slide
          if (this.state.activeSlide !== this.state.slidesCount - 1) {
            this.setActiveSlide(this.state.activeSlide + 1);
          } else {
            // If at the last slide, allow scrolling to footer
            document.body.removeEventListener("wheel", this.handleScroll);
            this._wheelListenerActive = false;
            setTimeout(() => {
              // Scroll to footer smoothly
              const footer = document.querySelector('footer');
              if (footer) {
                footer.scrollIntoView({ behavior: 'smooth' });
              }
            }, 300);
          }
        }
      }, 50);
    });
  }

  componentDidMount() {
    this.setState({ activeSlide: 3 });
    this.setAnimationState(ANIMATION_PHASES.PENDING);
    this.slider.header = document.querySelector(".tesla-header");
    this.slider.content = document.querySelector(".tesla-slider");
    
    // Add wheel listener for slider navigation
    document.body.addEventListener("wheel", this.handleScroll);
    this._wheelListenerActive = true;
    
    // Add scroll listener to detect when user scrolls back up from footer
    window.addEventListener('scroll', this.handleWindowScroll);
  }

  componentWillUnmount() {
    document.body.removeEventListener("wheel", this.handleScroll);
    window.removeEventListener('scroll', this.handleWindowScroll);
    window.clearTimeout(this.timeout);
    this.timeout = null;
    this._wheelListenerActive = false;
  }

  render() {
    return (
      <div className="tesla-slider">
        <SliderNavigation
          activeSlide={this.state.activeSlide}
          setActiveSlide={this.setActiveSlide}
          carsNames={slides.map((slide) => ({
            id: slide.id,
            name: slide.name,
            color: slide.color,
          }))}
        />
        <Slide
          animationForward={this.state.animationForward}
          activeSlide={slides[this.state.activeSlide]}
          animationState={this.state.animationState}
          setAnimationState={this.setAnimationState}
          ANIMATION_PHASES={ANIMATION_PHASES}
        />
        <div className="tesla-slider__scroll">
          <img src={mouseImg} alt="" />
          {this.state.activeSlide === this.state.slidesCount - 1 && (
            <div className="scroll-hint">
              <p>Cuộn xuống để xem thêm</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}



class App extends React.Component {
  render() {
    return (
      <div className="app-wrapper landing-page-no-scrollbar">
        <Header />
        <div className="container">
          <Slider />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;