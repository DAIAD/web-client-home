const React = require('react');
const { Link } = require('react-router');

function MainLogo(props) {
  const { imgPrefix, link = '/' } = props;
  return (
    <Link to={link} className="logo" activeClassName="selected">
      <img 
        src={`${imgPrefix}/daiad-logo-navy.svg`} 
        alt="DAIAD"
        title="DAIAD"
      />
    </Link>
  );
}

module.exports = MainLogo;
