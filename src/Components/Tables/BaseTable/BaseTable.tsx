import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

import { useTable, Column } from "react-table";

interface Props {
  data: { [key: string]: any }[];
  columns: Column<{ [key: string]: any }>[];
}

const BaseTable = ({ data, columns }: Props) => {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
    initialState: {
      hiddenColumns: columns
        .filter((col: any) => col.show === false)
        .map((col) => col.accessor) as any,
    },
  });

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableCell {...column.getHeaderProps()}>
                {column.render("Header")}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default BaseTable;
