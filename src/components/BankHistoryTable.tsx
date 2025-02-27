import React, { useEffect, useState } from 'react';
import { Paper, Table, Space, Group, Text, Pagination } from '@mantine/core';
import toLocale from '@/utils/numberFormatting';
import { useSearchParams } from 'next/navigation';
import router from 'next/router';

export default function BankHistoryTable({
  bankHistory = [],
  user,
  message,
  getTransactionType,
  getGoldTxSymbol,
  handleRowsPerPageChange,
  limit,
  page,
  totalPages
}) {
   
  if (message) {
    return <div className="text-center p-4">{message}</div>;
  }

  if (!bankHistory || bankHistory.length === 0) {
    return <div className="text-center p-4">No Records Found</div>;
  }

  return (
    <>
      <Space h="md" />
      <div className="mt-4 flex justify-between mb-2">
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => {
            const newPage = Math.max(page - 1, 1);
            router.push(`/structures/bank/history?page=${newPage}&limit=${limit}`);
          }}
          disabled={page === 1}
        >
          Previous
        </button>

        {/* Mantine pagination in the middle */}
        <Pagination
          total={totalPages}
          siblings={1}
          page={page}
          onChange={(xval) => {
            router.push(`/structures/bank/history?page=${xval}&limit=${limit}`);
          }}
        />

        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => {
            const newPage = page + 1;
            // If totalPages is known, disable if page >= totalPages
            router.push(`/structures/bank/history?page=${newPage}&limit=${limit}`);
          }}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
      <Space h="md" />
      <Paper shadow="xs">
        <Group>
          <Text size="sm">Show per page: </Text>
          {[10, 20, 50, 100].map(option => (
            <Text
              key={option}
              size="sm"
              c={Number(limit) === option ? 'dimmed' : 'white'}
              className='cursor-pointer'
              onClick={() => handleRowsPerPageChange(option)}
            >
              {option}
            </Text>
          ))}
        </Group>
        <Table className="min-w-full border-neutral-500" striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Transaction Type</Table.Th>
              <Table.Th>Amount</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {bankHistory.map((entry, index) => {
              const transactionType = getTransactionType(entry);
              let displayAmount = '';
              if (transactionType === 'Daily Reward') {
                // Example: "Daily Reward" might show Citizens instead of gold
                displayAmount = `+${entry.stats?.recruitingBonus} Citizens`;
              } else {
                displayAmount =
                  getGoldTxSymbol(entry) +
                  toLocale(entry.gold_amount, user?.locale) +
                  ' gold';
              }
              return (
                <Table.Tr key={index}>
                  <Table.Td>
                    {new Date(entry.date_time).toLocaleDateString()}{' '}
                    {new Date(entry.date_time).toLocaleTimeString()}
                  </Table.Td>
                  <Table.Td>{transactionType}</Table.Td>
                  <Table.Td>{displayAmount}</Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Paper>
    </>
  );
}
