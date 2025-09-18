import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

// Simple cubic bezier implementation (approx) for easing
function cubicBezier(p0, p1, p2, p3){
  return function(t){
    const cX = 3*p0; const bX = 3*(p2 - p0) - cX; const aX = 1 - cX - bX;
    const cY = 3*p1; const bY = 3*(p3 - p1) - cY; const aY = 1 - cY - bY;
    // Solve x for t ~ assume param t ~ progress for monotonic curves
    const y = ((aY*t + bY)*t + cY)*t; return y;
  };
}
const easing = cubicBezier(0.4, -0.7, 0.1, 1.5);

// Slides data adapted
const slides = [
  { id:1, name:'Model S', desc:'Hiệu năng & an toàn chuẩn cao cấp.', color:'#0047fd', imgFloor:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/truck-floor.png', img:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/truck-car.png', topSpeed:75, mph:4.5, mileRange:400 },
  { id:2, name:'Model X', desc:'SUV điện rộng rãi & mạnh mẽ.', color:'#ee0101', imgFloor:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/roadster-floor.png', img:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/roadster-car.png', topSpeed:255, mph:3, mileRange:520 },
  { id:3, name:'Model 3', desc:'Tối ưu chi phí – phù hợp đô thị.', color:'#0047fd', imgFloor:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/truck-floor.png', img:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/truck-car.png', topSpeed:55, mph:6, mileRange:550 },
  { id:4, name:'Roadster', desc:'Tăng tốc ngoạn mục & thiết kế thể thao.', color:'#ee0101', imgFloor:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/roadster-floor.png', img:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/roadster-car.png', topSpeed:250, mph:1.9, mileRange:620 },
  { id:5, name:'Semi Truck', desc:'Hiệu quả logistics tương lai.', color:'#0047fd', imgFloor:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/truck-floor.png', img:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/truck-car.png', topSpeed:65, mph:5, mileRange:500 }
];

const AnimatedValue = ({ value, duration=800, delay=0, format=(v)=>v }) => {
  const [display, setDisplay] = useState(0);
  useEffect(()=> {
    let raf; let start; let frame;
    function step(ts){
      if(!start) start = ts; const progress = Math.min(1, (ts-start)/duration);
      const eased = easing(progress); const current = value * eased;
      setDisplay(progress === 1 ? value : current);
      if(progress < 1){ raf = requestAnimationFrame(step);} }
    frame = setTimeout(()=> requestAnimationFrame(step), delay);
    return ()=> { cancelAnimationFrame(raf); clearTimeout(frame); };
  }, [value, duration, delay]);
  return <span>{format(display)}</span>;
};

const Landing = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const go = useCallback((i)=> setIndex((i+slides.length)%slides.length), []);
  useEffect(()=> { const t = setInterval(()=> go(index+1), 7000); return ()=> clearInterval(t); }, [index, go]);

  return (
    <div className="landing-wrapper">
      <div className="landing-container">
        <header className="landing-header">
          <div className="landing-logo">EVDM</div>
          <nav className="landing-nav">
            <a onClick={()=> navigate('/catalog')}>Vehicle</a>
            <a onClick={()=> navigate('/inventory')}>Inventory</a>
            <a onClick={()=> navigate('/dealer')}>Dealer</a>
            <a onClick={()=> navigate('/evm')}>EVM</a>
            <a onClick={()=> navigate('/reports')}>Reports</a>
          </nav>
        </header>
        <section className="landing-hero">
          <div className="slider-stage">
            {slides.map((s,i)=> (
              <div key={s.id} className={`slide-bg ${i===index? 'active':''}`} style={{'--btn-color': s.color}}>
                <div className="slide-info">
                  <h1 style={{color:s.color}}>{s.name}</h1>
                  <p>{s.desc}</p>
                  <div className="slide-stats">
                    <div className="stat">
                      <div className="stat-value"><AnimatedValue value={s.topSpeed} format={v=> Math.floor(v)+ ' mph'} /></div>
                      <div className="stat-label">Tốc độ</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value"><AnimatedValue value={s.mph} format={v=> (v%1!==0? v.toFixed(1):Math.floor(v)) + ' s'} delay={300} /></div>
                      <div className="stat-label">0-60 mph</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value"><AnimatedValue value={s.mileRange} format={v=> Math.floor(v)+ ' mi'} delay={600} /></div>
                      <div className="stat-label">Range</div>
                    </div>
                  </div>
                  <button className="reserve-btn" onClick={()=> navigate('/catalog')}>Khám phá xe</button>
                </div>
                <img className="slide-image" src={s.img} alt={s.name} />
              </div>
            ))}
            <div className="slider-dots">
              {slides.map((s,i)=> <button key={s.id} className={i===index? 'active':''} onClick={()=> setIndex(i)} />)}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
