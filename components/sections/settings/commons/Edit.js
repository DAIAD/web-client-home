const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedDate, FormattedTime } = require('react-intl');

const CommonFormFields = require('./Form');
const { IMAGES, BASE64 } = require('../../../../constants/HomeConstants');

function UpdateCommons(props) {
  const { _t, myCommons, commonForm, favorite, actions } = props;
  const { confirmUpdateCommon, confirmDeleteCommon, confirmLeaveCommon, updateCommonForm, saveFavoriteCommon } = actions;
  if (myCommons.length === 0) {
    return (
      <div style={{ margin: 20 }}>
        <h5><FormattedMessage id="commons.empty" /></h5>
      </div>
    );
  }
  return (
    <bs.Accordion 
      className="col-md-10" 
      animation={false}
      onSelect={(val) => { updateCommonForm(myCommons.find(c => c.key === val)); }}
    >
      {
        myCommons.map(common => ( 
          <bs.Panel 
            key={common.key}
            eventKey={common.key}
            header={
              <h3>
                { common.image ? 
                <img 
                  style={{ 
                    height: 30,
                    width: 30,
                    marginRight: 10,
                    border: '1px #2d3580 solid',
                  }} 
                  src={`${BASE64}${common.image}`} 
                  alt="member" 
                />
                :
                <img 
                  style={{ 
                    height: 30,
                    width: 30,
                    marginRight: 10,
                    border: '1px #2d3580 solid',
                  }} 
                  src={`${IMAGES}/commons-menu.svg`} 
                  alt="member" 
                />
                }
                {common.name || _t('forms.noname')}
              </h3>
              }
          >
            { favorite === common.key ?
              <button
                className="btn-a" 
                title={_t('commonsManage.resetFavorite')}
                style={{ float: 'right' }}
                onClick={(e) => {
                  e.preventDefault();
                  saveFavoriteCommon(null);
              }}
              >
                <i style={{ float: 'right' }} className="fa fa-star" />
              </button>
              :
              <button
                className="btn-a"   
                title={_t('commonsManage.setFavorite')}
                style={{ float: 'right' }}
                onClick={(e) => {
                  e.preventDefault();
                  saveFavoriteCommon(common.key);
              }}
              >
                <i style={{ float: 'right' }} className="fa fa-star-o" />
              </button>
             }
            <form 
              id={`form-common-update-${common.key}`}
              style={{ width: '100%' }}
              onSubmit={(e) => { 
                e.preventDefault();
                confirmUpdateCommon();
              }}
            >
              <CommonFormFields
                _t={_t}
                values={commonForm}
                onChange={updateCommonForm}
                disabled={!commonForm.owner}
              />
              
            <label htmlFor="common-size"><FormattedMessage id="commons.members" />:</label>
            <span id="common-size">{commonForm.size}</span>

            <br />
            <label htmlFor="common-created"><FormattedMessage id="commons.created" /></label>
            <span id="common-created">
              <FormattedDate value={commonForm.createdOn} />
            </span>
            
            <br />
            <label htmlFor="common-updated"><FormattedMessage id="commons.updated" /></label>
            <span id="common-updated">
              <FormattedDate value={commonForm.updatedOn} />
              &nbsp;
              <FormattedTime value={commonForm.updatedOn} />
            </span>
                    
              { commonForm.owner ? 
                <div>
                  
                  <bs.Button 
                    type="submit"
                    style={{ float: 'right' }} 
                  >
                    <FormattedMessage id="forms.update" />
                  </bs.Button>
                  <bs.Button 
                    style={{ float: 'right', marginRight: 10 }} 
                    bsStyle="danger"
                    onClick={(e) => { 
                      e.preventDefault();
                      confirmDeleteCommon();
                    }}
                  >
                    <FormattedMessage id="forms.delete" />
                  </bs.Button>
                </div>
                :
                <div >
                  <bs.Button 
                    style={{ float: 'right', marginRight: 10 }} 
                    bsStyle="warning"
                    onClick={(e) => {
                      e.preventDefault();
                      confirmLeaveCommon();
                    }}
                  >
                    <FormattedMessage id="forms.leave" />
                  </bs.Button>
                </div>
              }
            </form>
          </bs.Panel>
          ))
      }
    </bs.Accordion>
  );
}

module.exports = UpdateCommons;
