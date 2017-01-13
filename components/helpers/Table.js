const React = require('react');
const bs = require('react-bootstrap');
const { IMAGES } = require('../../constants/HomeConstants');

function Table(props) {
  const { className, fields, data } = props;
  if (!Array.isArray(fields)) {
    throw new Error('Fields must be array, check Table render');
  }
  if (!Array.isArray(data)) {
    throw new Error('Data must be array, check Table render');
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
              rowClassName(row) 
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
        <a className="navigator-child pull-left" onClick={() => onPageClick(active - 1)}>
          <img src={`${IMAGES}/arrow-big-left.svg`} alt="previous" />
        </a> 
          :
         <div />
        }
        {
          total > 0 ? 
            Array.from({ length: total }, (v, i) => i + 1)
            .map(page => 
              page === active ? 
                <u><a className="pagination-item active" style={{ marginLeft: 10 }} onClick={() => { onPageClick(page); }}>{page}</a></u>
              :
              <a className="pagination-item" style={{ marginLeft: 10 }} onClick={() => { onPageClick(page); }}>{page}</a>
              )
          :
           <div />
         }
         {
           active < total ?
         <a className="navigator-child pull-right" onClick={() => onPageClick(active + 1)}>
          <img src={`${IMAGES}/arrow-big-right.svg`} alt="next" />
        </a>
        :
          <div />
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
              field.value(row[field.id], field, row) 
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
