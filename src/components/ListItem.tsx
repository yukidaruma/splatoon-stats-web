import { User } from '@/interfaces';
import Link from 'next/link';
import React from 'react';

type Props = {
  data: User;
};

const ListItem = ({ data }: Props): React.ReactElement => (
  <Link href="/users/[id]" as={`/users/${data.id}`}>
    <a>
      {data.id}: {data.name}
    </a>
  </Link>
);

export default ListItem;
