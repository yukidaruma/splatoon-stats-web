import { User } from '@/interfaces';
import * as React from 'react';

type ListDetailProps = {
  item: User;
};

const ListDetail = ({ item: user }: ListDetailProps): React.ReactElement => (
  <div>
    <h1>Detail for {user.name}</h1>
    <p>ID: {user.id}</p>
  </div>
);

export default ListDetail;
