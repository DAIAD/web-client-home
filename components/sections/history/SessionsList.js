const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

const Table = require('../../helpers/Table');

function SessionsList(props) {
  const { _t, sortOptions, sortFilter, sortOrder, handleSortSelect, activeDeviceType, 
    csvData, time, sessionFields, sessions, setActiveSession, setSortOrder, setSortFilter, onSessionClick } = props;
  return (
    <div className="history-list-area">
      <div className="history-list-header">
        <h3 style={{ float: 'left' }}><FormattedMessage id="history.in-detail" /></h3>
        { 
          csvData ?  
            <a 
              style={{ float: 'left', marginLeft: 10 }} 
              className="btn" 
              href={`data:application/csv;charset=utf-8, ${csvData}`}
              download="Data.csv"
            >
              <FormattedMessage id="forms.download" />
            </a>
           :
           <span />
        }
        <div style={{ float: 'right' }}> 
          <h5 style={{ float: 'left', marginTop: 5 }}><FormattedMessage id="common.sortby" /></h5>
          <div 
            className="sort-options" 
            style={{ float: 'right', marginLeft: 10, textAlign: 'right' }}
          >
            <bs.DropdownButton
              title={sortOptions.find(sort => sort.id === sortFilter) ? 
                _t(sortOptions.find(sort => sort.id === sortFilter).title)
                : _t('history.volume')}
              id="sort-by"
              defaultValue={sortFilter}
              onSelect={handleSortSelect}
            >
              {
                sortOptions.map(sort => 
                  <bs.MenuItem 
                    key={sort.id} 
                    eventKey={sort.id} 
                    value={sort.id}
                  >
                    {_t(sort.title)}
                  </bs.MenuItem>
                )
              } 
            </bs.DropdownButton>

            <div style={{ float: 'right', marginLeft: 10 }}>
              {
                sortOrder === 'asc' ? 
                  <button 
                    className="btn-a"
                    onClick={() => setSortOrder('desc')}
                  >
                    <i className="fa fa-arrow-up" />
                  </button>
                 :
                 <button 
                   className="btn-a"
                   onClick={() => setSortOrder('asc')}
                 >
                   <i className="fa fa-arrow-down" />
                 </button>
              }
            </div>
          </div>
        </div>
      </div>
      
      <Table
        className="session-list"
        rowClassName="session-list-item"
        fields={sessionFields}
        data={sessions}
        onRowClick={onSessionClick}
      />
    </div>
  );
}

module.exports = SessionsList;
