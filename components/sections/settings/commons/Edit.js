const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');
const Select = require('react-select');

const CommonForm = require('./Form');

function EditCommons(props) {
  const { mode, myCommons, allCommons, setConfirm, setForm, updateCommon, clearCommon, common: commonForm, params } = props;
  //const defaultActive = params && params.id ? parseInt(params.id, 0) : null;
  //defaultActiveKey={defaultActive}
  return (
    <bs.Accordion 
      className="col-md-10" 
      animation={false}
      onSelect={(val) => { updateCommon(myCommons.find(c => c.id === val)); }}
    >
      {
        myCommons.map(common => ( 
          <bs.Panel 
            key={common.id}
            header={common.name}
            eventKey={common.id}
          >
            <CommonForm
              allCommons={allCommons}
              setConfirm={setConfirm}
              owned={common.owned}
              common={commonForm}
              updateCommon={updateCommon}
              clearCommon={clearCommon}
              edit
            />
          </bs.Panel>
          ))
      }
    </bs.Accordion>
  );
}

module.exports = EditCommons;
