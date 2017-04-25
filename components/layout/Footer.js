const React = require('react');
const { FormattedMessage } = require('react-intl');

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <ul style={{ listStyle: 'none', textAlign: 'center' }}>
          <li style={{ display: 'inline-block' }}>
            <a href="/">2017 DAIAD</a>
          </li>
          <li style={{ marginLeft: 20, display: 'inline-block' }}>
            <a href="http://daiad.eu">daiad.eu</a>
          </li>
          <li style={{ marginLeft: 20, display: 'inline-block' }}>
            <a href="/"><FormattedMessage id="footer.terms" /></a>
          </li>
          <li style={{ marginLeft: 20, display: 'inline-block' }}>
            <a href="/"><FormattedMessage id="footer.contact" /></a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

module.exports = Footer;
