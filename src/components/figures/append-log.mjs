export function initialLog() {
  return [
    { id: 101, name: 'Maya Sen', balance: 5000 },
    { id: 205, name: 'Priya', balance: 8000 },
    { id: 310, name: 'Rahul', balance: 2000 },
  ];
}

/** @param {ReturnType<typeof initialLog>} records */
export function appendDeposit(records) {
  const latest = records.findLast((record) => record.id === 101);
  if (!latest) return records;
  return [...records, { ...latest, balance: latest.balance + 1000 }];
}

/** @param {ReturnType<typeof initialLog>} records @param {number} id */
export function scanLog(records, id) {
  let balance = /** @type {number | null} */ (null);
  return records.map((record, index) => {
    if (record.id === id) balance = record.balance;
    return { index, balance, matched: record.id === id };
  });
}
