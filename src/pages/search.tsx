import Layout from '@/components/Layout';
import PlayerName from '@/components/PlayerName';
import { Player, RawPlayerSearchResult } from '@/interfaces';
import client from '@/utils/api-client';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import NextLink from 'next/link';

type Props = {
  errors?: string;
  players?: RawPlayerSearchResult[];
  query?: Nullable<string>;
};

const Search: NextPage<Props> = (props): React.ReactElement => {
  const { t } = useTranslation('ui');
  const rawPlayers = props.players ?? [];
  const players = rawPlayers.map((p) => Player.fromRawPlayer(p));

  return (
    <Layout title={props.query} headerTitle={t`search_result`}>
      {props.errors ? (
        <p>
          <span>Error:</span> {props.errors}
        </p>
      ) : (
        <>
          <SimpleGrid minChildWidth="300px" gap={[4, null, 6]}>
            {players.map((player, i) => (
              <NextLink key={i} href={`/players/${player.id}`}>
                <Box p="12px" bg="gray.700" className="clickable">
                  <p>
                    <Text as="span" mr="2" size="lg" fontWeight="bold">
                      <PlayerName player={player} />
                    </Text>
                    ({player.xPower})
                  </p>
                  {format(player.lastUsed!, 'yyyy-MM-dd')}
                </Box>
              </NextLink>
            ))}
          </SimpleGrid>
        </>
      )}
    </Layout>
  );
};

Search.getInitialProps = async (ctx) => {
  const { q } = ctx.query;
  const query = (q ?? '') as string;
  if (!query) return { query: null };

  try {
    const { data: players } = await client.get<RawPlayerSearchResult[]>(`/players/search`, {
      params: { name: query },
    });

    return {
      players,
      query,
    };
  } catch (e) {
    return { errors: e };
  }
};

export default Search;
