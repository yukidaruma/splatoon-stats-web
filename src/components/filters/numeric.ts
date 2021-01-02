import { FilterType } from 'react-table';

const filterFunctions: Record<'<' | '<=' | '>' | '>=', (rowA: number, value: number) => boolean> = {
  '<'(rowValue, filterValue) {
    return rowValue < filterValue;
  },
  '<='(rowValue, filterValue) {
    return rowValue <= filterValue;
  },
  '>'(rowValue, filterValue) {
    return rowValue > filterValue;
  },
  '>='(rowValue, filterValue) {
    return rowValue >= filterValue;
  },
};

type ComparisonOperators = keyof typeof filterFunctions;

// eslint-disable-next-line @typescript-eslint/ban-types
const numericFilter = <T extends object>(operator: ComparisonOperators): FilterType<T> => {
  const filterFn: FilterType<T> = (rows, [columnId], filterValue) => {
    return rows.filter((row) =>
      filterFunctions[operator](row.values[columnId], filterValue as number),
    );
  };

  filterFn.autoRemove = (val: any) => !val;

  return filterFn;
};

export default numericFilter;
