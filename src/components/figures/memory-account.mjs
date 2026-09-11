export const initialBalance = 5000;

/** @param {number | null} balance @param {'deposit' | 'restart' | 'reset'} action */
export function updateAccount(balance, action) {
  if (action === 'reset') return initialBalance;
  if (action === 'restart') return null;
  if (balance === null || balance > Number.MAX_SAFE_INTEGER - 1000) return balance;
  return balance + 1000;
}
