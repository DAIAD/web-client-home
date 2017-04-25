const React = require('react');

function Loader(props) {
  return (
    <div>
      <img 
        className="preloader" 
        src={`${props.imgPrefix}/preloader-counterclock.png`} 
        alt="loading" 
      />
      <img 
        className="preloader-inner" 
        src={`${props.imgPrefix}/preloader-clockwise.png`} 
        alt="loading" 
      />
    </div>
  );
}

module.exports = Loader;
