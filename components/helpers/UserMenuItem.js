const React = require('react');
const { Link } = require('react-router');

function UserMenuItem(props) {
  const { _t, imgPrefix, base64Prefix, link = 'settings/profile' } = props;
  return (
    <div className="user-menu" >
      <div title={_t('section.profile')}>
        <Link to={link}>
          <span><b>{props.firstname}</b></span>
          { 
            props.photo ? 
              <img 
                className="profile-header-photo"
                src={`${base64Prefix}${props.photo}`} 
                alt="profile" 
              />
              :
              <img
                className="profile-header-photo"
                src={`${imgPrefix}/daiad-consumer.png`} 
                alt="profile"
              />
           }
        </Link>
      </div>
    </div>
  );
}

module.exports = UserMenuItem;
