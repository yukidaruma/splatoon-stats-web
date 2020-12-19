import { NextApiRequest, NextApiResponse } from 'next';

import { sampleUserData } from '../../../utils/sample-data';

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!Array.isArray(sampleUserData)) {
      throw new Error('Cannot find user data');
    }

    res.status(200).json(sampleUserData);
  } catch (err) {
    res.status(500).json({ message: err.message, statusCode: 500 });
  }
};

export default handler;
