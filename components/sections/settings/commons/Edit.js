const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedDate, FormattedTime } = require('react-intl');

const CommonFormFields = require('./Form');

function UpdateCommons(props) {
  const { myCommons, commonForm, actions } = props;
  const { confirmUpdate, confirmDelete, confirmLeave, updateCommonForm } = actions;
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
            header={common.name || 'No name'}
            eventKey={common.key}
          >
            <form 
              id={`form-common-update-${common.key}`}
              style={{ width: '100%' }}
              onSubmit={(e) => { 
                e.preventDefault();
                confirmUpdate();
              }}
            >
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
                      confirmDelete();
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
                      confirmLeave();
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
