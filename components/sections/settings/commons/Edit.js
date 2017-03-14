const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedDate, FormattedTime } = require('react-intl');

const CommonFormFields = require('./Form');
const { IMAGES } = require('../../../../constants/HomeConstants');

function UpdateCommons(props) {
  const { myCommons, commonForm, favorite, actions } = props;
  const { confirmUpdateCommon, confirmDeleteCommon, confirmLeaveCommon, updateCommonForm, saveFavoriteCommon } = actions;
  if (myCommons.length === 0) {
    return (
      <div style={{ margin: 20 }}>
        <h5>No communities joined yet.</h5>
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
                  src={`data:image/png;base64,${common.image}`} 
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
                {common.name || 'No name'}
              </h3>
              }
          >
            <form 
              id={`form-common-update-${common.key}`}
              style={{ width: '100%' }}
              onSubmit={(e) => { 
                e.preventDefault();
                confirmUpdateCommon();
              }}
            >
            { favorite === common.key ?
              <a 
                style={{ float: 'right' }}
                onClick={() => {
                  saveFavoriteCommon(null);
              }}
              >
                <i style={{ float: 'right' }} className="fa fa-star" />
                <br />
                <span>Reset Favorite</span>
              </a>
              :
              <a 
                style={{ float: 'right' }}
                onClick={() => {
                  saveFavoriteCommon(common.key);
              }}
              >
                <i style={{ float: 'right' }} className="fa fa-star-o" />
                <br />
                <span>Set Favorite</span>
              </a>
             }
              <CommonFormFields
                values={commonForm}
                onChange={updateCommonForm}
                disabled={!commonForm.owner}
              />
              
            <label htmlFor="common-size">Members:</label>
            <span id="common-size">{commonForm.size}</span>

            <br />
            <label htmlFor="common-created">Created:</label>
            <span id="common-created">
              <FormattedDate value={commonForm.createdOn} />
            </span>
            
            <br />
            <label htmlFor="common-updated">Last updated:</label>
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
                    Update
                  </bs.Button>

                  <bs.Button 
                    style={{ float: 'right', marginRight: 10 }} 
                    bsStyle="danger"
                    onClick={() => { 
                      confirmDeleteCommon();
                    }}
                  >
                    Delete
                  </bs.Button>
                </div>
                :
                <div >
                  <bs.Button 
                    style={{ float: 'right', marginRight: 10 }} 
                    bsStyle="warning"
                    onClick={() => {
                      confirmLeaveCommon();
                    }}
                  >
                    Leave
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
