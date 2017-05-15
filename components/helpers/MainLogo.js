const React = require('react');
const { Link } = require('react-router');

function MainLogo(props) {
  const { imgPrefix, link = '/' } = props;
  return (
    <div className="logo">
      <Link to={link} activeClassName="selected">
        <img 
          src={`${imgPrefix}/daiad-logo-navy.svg`} 
          alt="DAIAD"
          title="DAIAD"
        />
      </Link>
    </div>
  );
}

module.exports = MainLogo;
