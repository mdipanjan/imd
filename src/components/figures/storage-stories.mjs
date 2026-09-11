const pane = (id, title, kind, rows, note = '') => ({ id, title, kind, rows, note });
const state = (message, panes, transfer = null) => ({ message, panes, transfer });
const move = (from, row, to, label) => ({ from, row, to, label });
const segmentInputs = ['101 · Maya · 5000', '101 · Maya · 6000', '101 · Maya · 6500'];
const mergeA = ['101 · Maya · 6500', '205 · Priya · 8000', '310 · Rahul · 2000'];
const mergeB = ['101 · Maya · 7000', '150 · Ananya · 4000', '205 · Priya · 9000'];
const merged = [
  '101 · Maya · 7000',
  '150 · Ananya · 4000',
  '205 · Priya · 9000',
  '310 · Rahul · 2000',
];

const segmentPanes = (output, active = [], note = 'writing', retired = false) => [
  pane(
    'closed',
    'Closed segments',
    'file',
    retired ? [] : segmentInputs,
    retired ? 'retired after reader handoff' : 'immutable inputs · Maya’s versions',
  ),
  pane('output', 'Compacted copy', 'file', output, note),
  pane(
    'active',
    'Active segment',
    'file',
    active,
    active.length ? 'index 101 → active · latest 7000' : 'accepting new writes',
  ),
];
const mergePanes = (output) => [
  pane('a', 'Earlier writes', 'file', mergeA, 'input remains intact'),
  pane('b', 'Later writes', 'file', mergeB, 'input remains intact'),
  pane('out', 'Merged SSTable', 'table', output, 'sorted output'),
];
const memPanes = (active, frozen, table, note) => [
  pane('active', 'Active memtable', 'memory', active, 'RAM · accepts writes'),
  pane('frozen', 'Frozen memtable', 'memory', frozen, 'RAM · no new writes'),
  pane('existing', 'Existing SSTable', 'table', table.slice(0, 1), 'installed · older version'),
  pane(
    'table',
    'New SSTable',
    'table',
    table.slice(1),
    note === 'installed'
      ? 'not written yet'
      : note.includes('not installed')
        ? 'written · not installed'
        : 'installed · active is newer',
  ),
];
const walPanes = (wal, ram, note) => [
  pane('wal', 'Write-ahead log', 'file', wal, note),
  pane('ram', 'Active memtable', 'memory', ram, 'RAM'),
  pane('disk', 'Installed SSTable', 'table', ['205 · Priya · 9000'], 'older durable balance'),
];
const handoffPanes = (table, note, wal = true, frozen = true, registered = false) => [
  pane(
    'ram',
    'Frozen batch',
    'memory',
    frozen ? ['205 · Priya · 10000'] : [],
    frozen ? 'retained for readers' : 'released after reader handoff',
  ),
  pane(
    'wal',
    'Batch WAL',
    'file',
    wal ? ['seq n · 205 · 10000'] : [],
    wal ? 'retained for recovery' : 'retired',
  ),
  pane('table', 'New SSTable', 'table', table, note),
  pane(
    'manifest',
    'Manifest',
    'manifest',
    registered ? ['live: table-new.sst', 'batch WAL: obsolete'] : ['live: previous tables'],
    'durable file-set bookkeeping',
  ),
];

export const stories = {
  segments: {
    title: 'Compact closed segments while writes continue',
    caption:
      'A compacted copy cannot overwrite a newer index entry. This figure follows Maya’s versions; other accounts are omitted.',
    steps: [
      state(
        'Closed segments give compaction a stable input while a fresh segment accepts writes.',
        segmentPanes([]),
      ),
      state(
        'Copy Maya’s latest closed record. Keep the immutable inputs available.',
        segmentPanes(['101 · Maya · 6500']),
        move('closed', 2, 'output', '101 · Maya · 6500'),
      ),
      state(
        'Another ₹500 arrives in the active segment. Its 7000 version becomes current.',
        segmentPanes(['101 · Maya · 6500'], ['101 · Maya · 7000']),
        move(null, 0, 'active', 'deposit → 7000'),
      ),
      state(
        'Sync and install the compacted file. The index still points to 7000 in the active segment.',
        segmentPanes(['101 · Maya · 6500'], ['101 · Maya · 7000'], 'durable · installed'),
      ),
      state(
        'After existing readers finish, retire the closed inputs. The active 7000 record still wins.',
        segmentPanes(['101 · Maya · 6500'], ['101 · Maya · 7000'], 'installed', true),
      ),
    ],
  },
  'sorted-merge': {
    title: 'Merge two sorted tables',
    caption:
      'Advance the input with the smallest key. When keys match, keep the newer write and advance both inputs. Sources remain intact during copying.',
    steps: [
      state('Both inputs are sorted. Compare their next unread keys.', mergePanes([])),
      state(
        'Both start with 101. Keep the later 7000 version and advance both inputs.',
        mergePanes(merged.slice(0, 1)),
        move('b', 0, 'out', merged[0]),
      ),
      state(
        '150 comes before 205. Copy 150 and advance the later input.',
        mergePanes(merged.slice(0, 2)),
        move('b', 1, 'out', merged[1]),
      ),
      state(
        'Both now have 205. Keep Priya’s later 9000 version.',
        mergePanes(merged.slice(0, 3)),
        move('b', 2, 'out', merged[2]),
      ),
      state(
        'Copy the remaining 310. The output is sorted, with the newest version of each key.',
        mergePanes(merged),
        move('a', 2, 'out', merged[3]),
      ),
    ],
  },
  'sparse-index': {
    title: 'Find a record through a sparse index',
    caption:
      'Boundary keys identify a candidate block. The index has an entry per block, rather than per account. Block sizes here are schematic.',
    steps: [
      state('Find account 205. Start with the small block index.', [
        pane('index', 'Block index', 'index', ['101 → block A', '310 → block B']),
        pane('block', 'Block A', 'table', merged.slice(0, 3), 'not read yet'),
        pane('result', 'Lookup 205', 'result', []),
      ]),
      state(
        '205 lies between boundary keys 101 and 310, so read block A.',
        [
          pane('index', 'Block index', 'index', ['101 → block A', '310 → block B']),
          pane('block', 'Block A', 'table', merged.slice(0, 3), 'candidate block selected'),
          pane('result', 'Lookup 205', 'result', []),
        ],
        move('index', 0, 'block', 'read block A'),
      ),
      state(
        'Search within block A. The account’s value is Priya, 9000.',
        [
          pane('index', 'Block index', 'index', ['101 → block A', '310 → block B']),
          pane('block', 'Block A', 'table', merged.slice(0, 3), '205 found'),
          pane(
            'result',
            'Lookup 205',
            'result',
            ['205 · Priya · 9000'],
            'one candidate block read',
          ),
        ],
        move('block', 2, 'result', '205 · Priya · 9000'),
      ),
    ],
  },
  memtable: {
    title: 'Read across active, frozen, and installed data',
    caption:
      'These rows show the logical contents of ordered maps. A flush copies the frozen batch; it does not replace newer values in the active batch.',
    steps: [
      state(
        'Priya’s 9500 update is in the active memtable; the installed table still holds 9000.',
        memPanes(['205 · Priya · 9500'], [], ['205 · Priya · 9000'], 'installed'),
      ),
      state(
        'The memory budget is reached. Freeze this batch and open a new active memtable.',
        memPanes([], ['205 · Priya · 9500'], ['205 · Priya · 9000'], 'installed'),
        move('active', 0, 'frozen', '205 · Priya · 9500'),
      ),
      state(
        'A further ₹300 deposit enters the new active batch as 9800.',
        memPanes(
          ['205 · Priya · 9800'],
          ['205 · Priya · 9500'],
          ['205 · Priya · 9000'],
          'installed',
        ),
        move(null, 0, 'active', '205 · Priya · 9800'),
      ),
      state(
        'Read 205 from active RAM: 9800. The frozen and installed versions are older.',
        memPanes(
          ['205 · Priya · 9800'],
          ['205 · Priya · 9500'],
          ['205 · Priya · 9000'],
          'installed',
        ),
      ),
      state(
        'Copy the frozen 9500 record into an output table. Keep the frozen source readable.',
        memPanes(
          ['205 · Priya · 9800'],
          ['205 · Priya · 9500'],
          ['205 · Priya · 9000', '205 · Priya · 9500'],
          '9000 installed · 9500 output not installed',
        ),
        move('frozen', 0, 'table', '205 · Priya · 9500'),
      ),
      state(
        'Sync and register the output table, then finish old readers and release frozen RAM. Active 9800 still wins.',
        memPanes(
          ['205 · Priya · 9800'],
          [],
          ['205 · Priya · 9000', '205 · Priya · 9500'],
          'both tables installed · active is newer',
        ),
      ),
    ],
  },
  wal: {
    title: 'Recover an acknowledged update',
    caption:
      'Revisiting the 9800 write before the previous figure’s flush. Earlier WAL records are omitted. Sync is simulated; replay restores the stored balance without repeating the deposit.',
    steps: [
      state(
        'Revisit the 9800 write before its flush. The older installed table holds 9000; earlier WAL history is omitted.',
        walPanes([], [], 'ready to append'),
      ),
      state(
        'Append the sequence number and full updated balance to the WAL.',
        walPanes(['seq n · 205 · 9800'], [], 'written · not yet synced'),
        move(null, 0, 'wal', 'seq n · 205 · 9800'),
      ),
      state(
        'Sync the WAL successfully before acknowledging the update.',
        walPanes(['seq n · 205 · 9800'], [], 'sync succeeded · durable'),
      ),
      state(
        'Apply 9800 to the memtable, then return success. Keep the WAL for recovery.',
        walPanes(['seq n · 205 · 9800'], ['205 · Priya · 9800'], 'durable · retained'),
        move('wal', 0, 'ram', '205 · Priya · 9800'),
      ),
      state(
        'The process crashes. RAM disappears; the WAL and installed table survive.',
        walPanes(['seq n · 205 · 9800'], [], 'durable · retained'),
      ),
      state(
        'Replay the stored record into a new memtable. Priya is back to 9800, not 10100.',
        walPanes(
          ['seq n · 205 · 9800'],
          ['205 · Priya · 9800'],
          'retained until table installation',
        ),
        move('wal', 0, 'ram', '205 · Priya · 9800'),
      ),
    ],
  },
  lifecycle: {
    title: 'Hand recovery from the WAL to an SSTable',
    caption:
      'A durable table and a durable manifest handoff must precede WAL retirement. Frozen memory is released only after its readers finish.',
    steps: [
      state(
        'Priya’s 10000 balance is in a frozen batch, protected by its retained WAL.',
        handoffPanes([], 'not written'),
      ),
      state(
        'Flush a copy into a new SSTable. Keep both the frozen batch and its WAL.',
        handoffPanes(['205 · Priya · 10000'], 'written · not installed'),
        move('ram', 0, 'table', '205 · Priya · 10000'),
      ),
      state(
        'Make the completed table durable, including the filesystem work needed to preserve its name.',
        handoffPanes(['205 · Priya · 10000'], 'synced · not registered'),
      ),
      state(
        'Durably record the new live table and obsolete WAL in the manifest.',
        handoffPanes(['205 · Priya · 10000'], 'installed', true, true, true),
        move('table', 0, 'manifest', 'register table-new.sst'),
      ),
      state(
        'Now retire this batch’s WAL and release frozen memory after its readers finish.',
        handoffPanes(['205 · Priya · 10000'], 'installed · recovery source', false, false, true),
      ),
    ],
  },
};

export function getStory(id) {
  if (!Object.hasOwn(stories, id)) throw new Error(`Unknown storage story: ${id}`);
  return stories[id];
}
