const React = require('react');
const bs = require('react-bootstrap');
const { IMAGES } = require('../../constants/HomeConstants');

function Table(props) {
  const { className, fields, data, empty = '' } = props;
  if (!Array.isArray(fields)) {
    throw new Error('Fields must be array, check Table render');
  }
  if (!Array.isArray(data)) {
    throw new Error('Data must be array, check Table render');
  }
  if (!data.length) {
    return <div className={[className, 'empty'].join(' ')}>{empty}</div>;
  }
  return (
    <div>
      <table className={className}>
        <TableHeader {...props} />
        <TableBody {...props} />
      </table>
      <Pagination {...props.pagination} />
    </div>
  );
}

function TableHeader(props) {
  const { fields } = props;
  return (
    <thead>
      <tr>
        {
          fields.map(field => (
            <th key={field.id}>
              { 
              field.icon ? 
                <i className={`fa fa-${field.icon}`} /> 
                : <i />
              }
              { field.name }
            </th>
            ))
        }
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const { data, fields, rowClassName, onRowClick } = props;
  return (
    <tbody>
      {
        data.map((row, idx) => (
          <TableRow 
            key={idx}
            className={typeof rowClassName === 'function' ? 
              rowClassName(row, idx) 
                : rowClassName
            }
            onRowClick={onRowClick}
            fields={fields}
            row={row} 
            idx={idx} 
          />
        ))
      }
    </tbody>
  );
}

function Pagination(props) {
  const { total, active, onPageClick } = props;
  return (
    <div className="pagination" style={{ width: '100%', textAlign: 'center' }}>
      
      <div className="navigator">
        {
          active > 1 ?
            <div className="navigator-child pull-left">
              <button 
                className="btn-a" 
                onClick={() => onPageClick(active - 1)}
              >
                <img src={`${IMAGES}/arrow-big-left.svg`} alt="previous" />
              </button> 
          </div>
          :
            <div className="navigator-child pull-left">&nbsp;</div>
        }
        {
          total > 0 ? 
            Array.from({ length: total }, (v, i) => i + 1)
            .map(page => 
              <button 
                key={page} 
                className={`btn-a pagination-item ${page === active ? 'active' : ''}`}
                style={{ marginLeft: 10 }} 
                onClick={() => { onPageClick(page); }}
              >
                {page}
              </button>
              )
             :
             <div />
         }
         {
           active < total ?
             <div className="navigator-child pull-right">
               <button 
                 className="btn-a" 
                 onClick={() => onPageClick(active + 1)}
               >
                <img src={`${IMAGES}/arrow-big-right.svg`} alt="next" />
              </button>
            </div>
        :
          <div className="navigator-child pull-right">&nbsp;</div>
        }
      </div>
    </div>

  );
}

function TableRow(props) {
  const { fields, row, idx: rowIdx, className, onRowClick } = props;
  return (
    <tr
      className={className}
      onClick={() => onRowClick(row)}
    >
      {
        fields.map((field, idx) => (
          <TableItem 
            key={field.id} 
            columnIdx={idx} 
            field={field}
            item={field.value ? 
              field.value(row[field.id], row) 
              : 
              row[field.id]
            } 
          />
        ))
      }
    </tr>
  );
}

function TableItem(props) {
  const { columnIdx, field, item } = props;
  //const { icon, name } = field;
  return (
    <td>
      { item }
    </td>
  );
}

module.exports = Table;
