export function initialRecords() {
  return [
    { id: 101, name: 'Maya Sen', balance: 5000 },
    { id: 205, name: 'Priya', balance: 8000 },
    { id: 310, name: 'Rahul', balance: 2000 },
    { id: 101, name: 'Maya Sen', balance: 6000 },
  ];
}
/** @param {ReturnType<typeof initialRecords>[number]} record */
export function encodeRecord(record) {
  return `${record.id}, ${record.name.padEnd(8)}, ${record.balance}\n`;
}
/** @param {ReturnType<typeof initialRecords>} records */
export function locateRecords(records) {
  let offset = 0;
  return records.map((record) => {
    const located = { ...record, offset };
    offset += new TextEncoder().encode(encodeRecord(record)).length;
    return located;
  });
}
/** @param {ReturnType<typeof initialRecords>} records */
export function rebuildIndex(records) {
  return new Map(locateRecords(records).map((record) => [record.id, record.offset]));
}
/** @param {ReturnType<typeof initialRecords>} records */
export function depositRecord(records) {
  const latest = records.findLast((record) => record.id === 101);
  if (!latest) return records;
  return [...records, { ...latest, balance: latest.balance + 500 }];
}
