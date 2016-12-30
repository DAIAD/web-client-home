const React = require('react');
const bs = require('react-bootstrap');

function Table(props) {
  const { className, fields, data } = props;
  if (!Array.isArray(fields)) {
    throw new Error('Fields must be array, check Table render');
  }
  if (!Array.isArray(data)) {
    throw new Error('Data must be array, check Table render');
  }
  return (
    <table className={className}>
      <TableHeader {...props} />
      <TableBody {...props} />
    </table>
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
