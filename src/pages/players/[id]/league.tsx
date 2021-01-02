import numericFilter from '@/components/filters/numeric';
import NumericColumnFilter, {
  NumericColumnFilterOptions,
} from '@/components/filters/NumericColumnFilter';
import Layout from '@/components/Layout';
import PlayerName from '@/components/PlayerName';
import Weapon from '@/components/Weapon';
import { Player, RawPlayer } from '@/interfaces';
import { toTitleCase } from '@/utils';
import client from '@/utils/api-client';
import { HStack } from '@chakra-ui/react';
import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import React, { useMemo } from 'react';
import { Column, useFilters, usePagination, useSortBy, useTable } from 'react-table';

type LeaguTeammate = {
  player_id: string;
  player_name: Nullable<string>;
  weapon_id: number;
};

type LeagueRankingRecord = {
  group_id: string;
  group_type: 'P' | 'T';
  rank: number;
  rating: number;
  rule_id: number;
  start_time: string;
  teammates: LeaguTeammate[];
  weapon_id: number;
};

type Props = {
  league: LeagueRankingRecord[];
  player: Partial<RawPlayer>; // TODO: remove partial
};

const pageSizeOptions = [10, 25, 50];

const PlayerPage: NextPage<Props> = ({ league, player }) => {
  const filterTypes = {
    gteFilter: numericFilter<LeagueRankingRecord>('>='),
    lteFilter: numericFilter<LeagueRankingRecord>('<='),
  };

  const { t } = useTranslation('ui');
  const columns = useMemo(
    (): Column<LeagueRankingRecord>[] => [
      {
        Cell({ cell }) {
          return t(`group_types.${cell.value}`);
        },
        Header: '',
        accessor: 'group_type',
        className: 'capitalize',
      },
      {
        Cell({ cell }) {
          return t(`rule_shortnames.${cell.value}`);
        },
        Header: t`rule`,
        accessor: 'rule_id',
      },
      {
        Cell({ cell }) {
          return `#${cell.value}`;
        },
        Filter: NumericColumnFilter,
        Header: t`min_rank`,
        accessor: 'rank',
        filter: 'lteFilter',
        filterOptions: {
          max: 100,
          min: 1,
        } as NumericColumnFilterOptions,
      },
      {
        Filter: NumericColumnFilter,
        Header: t`min_power`,
        accessor: 'rating',
        filter: 'gteFilter',
        filterOptions: {
          min: 0,
          step: 100,
        } as NumericColumnFilterOptions,
      },
      {
        Cell({ cell }) {
          return <Weapon weaponId={cell.value} />;
        },
        Header: t`weapon`,
        accessor: 'weapon_id',
      },
      {
        Cell({ cell }) {
          return (
            <>
              {cell.value.map((teammate) => (
                <HStack key={teammate.player_id}>
                  <Weapon weaponId={teammate.weapon_id} />
                  <PlayerName player={Player.fromRawPlayer(teammate)} />
                </HStack>
              ))}
            </>
          );
        },
        Header: t`teammates`,
        accessor: 'teammates',
        sortType(rowA, rowB, _id) {
          return rowA.original.group_id.localeCompare(rowB.original.group_id);
        },
      },
    ],
    [],
  );

  const instance = useTable<LeagueRankingRecord>(
    {
      columns,
      data: league,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: pageSizeOptions[0],
      },
    },
    useFilters,
    useSortBy,
    usePagination,
  );
  const {
    canNextPage,
    canPreviousPage,
    getTableBodyProps,
    getTableProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageCount,
    prepareRow,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = instance;

  return (
    <Layout title={player.player_id + ' - ' + toTitleCase(t`league_battle`)} noPathTitle>
      {instance.columns
        .filter(({ Filter }) => !!Filter)
        .map((column) => column.render('Filter', { key: column.id }))}

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="capitalize">
                  {column.render('Header')}
                  {column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);

            return (
              // eslint-disable-next-line react/jsx-key
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <td
                      {...cell.getCellProps({
                        className: cell.column.className,
                      })}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        {pageIndex + 1}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          <strong>
            {pageIndex * pageSize + 1} - {Math.min(league.length, (pageIndex + 1) * pageSize)} /{' '}
            {league.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}>
          {pageSizeOptions.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </Layout>
  );
};

PlayerPage.getInitialProps = async (ctx) => {
  const playerId = ctx.query.id as string;

  const { data: league } = await client.get(`/players/${playerId}/rankings/league`);

  return {
    league,
    player: {
      player_id: playerId,
    },
  };
};

export default PlayerPage;
