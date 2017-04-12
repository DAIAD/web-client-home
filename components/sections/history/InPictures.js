const React = require('react');

const { IMAGES } = require('../../../constants/HomeConstants'); 

function Picture(props) {
  const { display, items, metric, remaining, iconSuffix = '', _t } = props;
  return (
    <img 
      src={`${IMAGES}/${display}${iconSuffix}.svg`} 
      className={['picture', display].join(' ')}
      title={_t('history.inPicturesHover',
        {
          number: items, 
          metric: _t(`history.${metric}`).toLowerCase(),
          scale: _t(`history.${display}`),
        })
      }
      alt={display}
    />
  );
}

function InPictures(props) {
  const { display, items, remaining, metric } = props;
  return (
    <div className="in-pictures">
      {
        Array.from({ length: items }).map((v, i) => (
          <Picture {...props} />
          ))
      }
      {(() => {
        if (remaining === 0.25) {
          return <Picture {...props} iconSuffix="-25" />;
        } else if (remaining === 0.5) {
          return <Picture {...props} iconSuffix="-50" />;
        } else if (remaining === 0.75) {
          return <Picture {...props} iconSuffix="-75" />;
        }
        return <i />;
      })()
      }
    </div>
  );
}

module.exports = InPictures;
