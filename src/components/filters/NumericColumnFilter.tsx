import { toTitleCase } from '@/utils';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
} from '@chakra-ui/react';
import React, { ReactElement, useEffect } from 'react';
import { FilterProps } from 'react-table';

export type NumericColumnFilterOptions = {
  max?: number;
  min?: number;
  step?: number;
};

// eslint-disable-next-line @typescript-eslint/ban-types
const NumericColumnFilter = <T extends {}>({ column }: FilterProps<T>): ReactElement => {
  const { filterValue, render, setFilter } = column;
  const filterOptions = column.filterOptions as NumericColumnFilterOptions;

  const [value, setValue] = React.useState('');
  const handleChange = (value: string) => {
    setValue(value);
    setFilter(value);
  };

  useEffect(() => {
    setValue(filterValue ?? '');
  }, [filterValue]);

  const placeholder = toTitleCase(render('Header') as string);
  const props: NumberInputProps = {
    ...filterOptions,
    onChange: handleChange,
    value,
  };

  return (
    <NumberInput {...props}>
      <NumberInputField placeholder={placeholder} />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default NumericColumnFilter;
