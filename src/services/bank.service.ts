import { stringifyObj } from '@/utils/numberFormatting';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deposit = async (userId: number, depositAmount: bigint) => {
  return await prisma.$transaction(async (prisma) => {
    const user = await prisma.users.findUnique({ where: { id: userId } });

    if (!user) throw new Error('User not found');
    if (depositAmount > BigInt(user.gold)) throw new Error('Not enough gold for deposit');

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        gold: user.gold - depositAmount,
        gold_in_bank: user.gold_in_bank + depositAmount,
      },
    });

    await prisma.bank_history.create({
      data: {
        gold_amount: depositAmount,
        from_user_id: userId,
        from_user_account_type: 'HAND',
        to_user_id: userId,
        to_user_account_type: 'BANK',
        date_time: new Date(),
        history_type: 'PLAYER_TRANSFER',
      },
    });

    return stringifyObj(updatedUser);
  });
};

export const withdraw = async (userId: number, withdrawAmount: bigint) => {
  return await prisma.$transaction(async (prisma) => {
    const user = await prisma.users.findUnique({ where: { id: userId } });

    if (!user) throw new Error('User not found');
    if (withdrawAmount > BigInt(user.gold_in_bank)) throw new Error('Not enough gold for withdrawal');

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        gold: user.gold + withdrawAmount,
        gold_in_bank: user.gold_in_bank - withdrawAmount,
      },
    });

    await prisma.bank_history.create({
      data: {
        gold_amount: withdrawAmount,
        from_user_id: userId,
        from_user_account_type: 'BANK',
        to_user_id: userId,
        to_user_account_type: 'HAND',
        date_time: new Date(),
        history_type: 'PLAYER_TRANSFER',
      },
    });

    return updatedUser;
  });
};

export const getDepositHistory = async (userId: number) => {
  return await prisma.bank_history.findMany({
    where: {
      from_user_id: userId,
      to_user_id: userId,
      from_user_account_type: 'HAND',
      to_user_account_type: 'BANK',
      history_type: 'PLAYER_TRANSFER',
      date_time: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      },
    },
    orderBy: {
      date_time: 'asc',
    },
  });
};

export const getBankHistory = async (conditions: any) => {
  return await prisma.bank_history.findMany({
    where: {
      OR: conditions.length > 0 ? conditions : undefined,
    },
    orderBy: {
      date_time: 'desc',
    },
  });
};
