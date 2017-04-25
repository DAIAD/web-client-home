const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedDate } = require('react-intl');

const Table = require('../../helpers/Table');

const { commons: commonsSchema, allCommons: allCommonsSchema, members: membersSchema } = require('../../schemas/commons');

const { debounce } = require('../../../utils/general');

const { COMMONS_MEMBERS_PAGE, COMMONS_USER_SORT } = require('../../../constants/HomeConstants'); 

function MembersArea(props) {
  const { _t, handleSortSelect, searchFilter, members, actions } = props;

  const { selected: selectedMembers, active: activeMembers, sortFilter, sortOrder, count: memberCount, pagingIndex } = members;

  const { setDataQueryAndFetch, setSearchFilter, addMemberToChart, removeMemberFromChart, setMemberSortFilter, setMemberSortOrder, setMemberSearchFilter, searchCommonMembers, setMemberQueryAndFetch, fetchData } = actions;

  return (
    <div className="commons-members-area">
      <div style={{ marginTop: 20, marginBottom: 0, marginLeft: 20 }}>
        <h5>
          <FormattedMessage id="commons.members" />
        </h5>
      </div>
      <div className="members-search" style={{ float: 'left', marginLeft: 20 }}>
        <form 
          className="search-field" 
          onSubmit={(e) => { 
            e.preventDefault(); 
            setMemberQueryAndFetch({ index: 0 }); 
          }}
        >
          <input 
            type="text"
            placeholder={_t('commons.placeholder-search-members')}
            onChange={(e) => { 
              setMemberSearchFilter(e.target.value);
              debounce(() => { 
                setMemberQueryAndFetch({ index: 0 }); 
              }, 300)();
            }}
            value={searchFilter}
          />
          <button 
            className="clear-button" 
            type="reset" 
            onClick={(e) => { setMemberQueryAndFetch({ index: 0, name: '' }); }} 
          />
        </form>
      </div>

      <div className="members-sort" style={{ float: 'right', marginRight: 10 }}> 
        <h5 style={{ float: 'left', marginTop: 5 }}><FormattedMessage id="common.sortby" /></h5>
        <div 
          className="sort-options" 
          style={{ float: 'right', marginLeft: 10, textAlign: 'right' }}
        >
          <bs.DropdownButton
            title={COMMONS_USER_SORT.find(sort => sort.id === sortFilter) ? 
              _t(COMMONS_USER_SORT.find(sort => sort.id === sortFilter).title)
              : _t('profile.lastname')}
            id="sort-by"
            defaultValue={sortFilter}
            onSelect={handleSortSelect}
          >
            {
              COMMONS_USER_SORT.map(sort =>
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
          <div style={{ float: 'right', marginLeft: 20 }}>
            {
              sortOrder === 'asc' ? 
                <button 
                  className="btn-a"
                  onClick={() => setMemberQueryAndFetch({ sortOrder: 'desc' })}
                >
                  <i className="fa fa-arrow-up" />
                </button>
               :
               <button
                 className="btn-a"
                 onClick={() => setMemberQueryAndFetch({ sortOrder: 'asc' })}
               >
                 <i className="fa fa-arrow-down" />
               </button>
            }
          </div>
        </div>
      </div>
      
      <br />
      <div>
        <p style={{ marginLeft: 20 }}><b><FormattedMessage id="common.found" />:</b> {memberCount}</p>
        <p style={{ marginLeft: 20 }}><i className="fa fa-info-circle" />&nbsp;<i><FormattedMessage id="commons.select-info" /></i></p>
      </div>

      <Table
        className="session-list"
        rowClassName={row => selectedMembers.find(m => m.key === row.key) ? 'session-list-item selected' : 'session-list-item'}
        fields={membersSchema}
        data={activeMembers}
        pagination={{
          total: Math.ceil(memberCount / COMMONS_MEMBERS_PAGE),
          active: pagingIndex,
          onPageClick: (page) => { 
            setMemberQueryAndFetch({ index: page - 1 });
          },
        }}
        onRowClick={(row) => {
          if (selectedMembers.map(u => u.key).includes(row.key)) {
            removeMemberFromChart(row);
          } else if (selectedMembers.length < 3) {
            addMemberToChart({ ...row, selected: selectedMembers.length + 1 });
          }
        }}
      />
    </div>
  );
}

module.exports = MembersArea;
