import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/middleware/auth';
import { withdraw } from '@/services/bank.service';
import { stringifyObj } from '@/utils/numberFormatting';

const withdrawHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const session = req.session;
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const withdrawAmount = BigInt(req.body.withdrawAmount);

  try {
    const updatedUser = await withdraw(Number(session.user.id), withdrawAmount);
    return res.status(200).json({ message: 'Withdraw successful', data: stringifyObj(updatedUser) });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default withAuth(withdrawHandler);
