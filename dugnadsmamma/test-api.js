/**
 * Dugnadsmamma API Integration Tests
 * Runs against live Azure SQL via the deployed API.
 * Usage: node test-api.js [baseUrl]
 * Default baseUrl: https://janinc.no
 */

const BASE = (process.argv[2] || 'https://janinc.no').replace(/\/$/, '');
const API = `${BASE}/api/dugnad`;

let testChildId = null;
let testDugnadSalesId = null;
let testDugnadPhysicalId = null;
let testItemId = null;
let testSaleId = null;
let testTaskId = null;

let passed = 0;
let failed = 0;

async function api(method, body) {
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(API, opts);
    const data = await res.json();
    return { status: res.status, data };
}

function assert(condition, msg) {
    if (!condition) throw new Error(msg);
}

async function test(name, fn) {
    try {
        await fn();
        passed++;
        console.log(`  ✅ ${name}`);
    } catch (err) {
        failed++;
        console.log(`  ❌ ${name}: ${err.message}`);
    }
}

async function run() {
    console.log(`\n🧪 Dugnadsmamma API Tests — ${API}\n`);

    // 1. init_db
    await test('init_db creates tables idempotently', async () => {
        const { status, data } = await api('POST', { action: 'init_db' });
        assert(status === 200, `Expected 200, got ${status}`);
        assert(data.ok === true, 'Expected ok: true');
        // Run twice to confirm idempotency
        const r2 = await api('POST', { action: 'init_db' });
        assert(r2.status === 200, 'Second init_db failed');
    });

    // 2. add_child
    await test('add_child creates a test child', async () => {
        const { status, data } = await api('POST', {
            action: 'add_child',
            name: '__TEST_BARN__',
            team: 'G99',
        });
        assert(status === 201, `Expected 201, got ${status}`);
        assert(data.id > 0, 'Expected id > 0');
        assert(data.name === '__TEST_BARN__', 'Name mismatch');
        testChildId = data.id;
    });

    // 3. add_dugnad (sales)
    await test('add_dugnad creates a sales dugnad', async () => {
        const { status, data } = await api('POST', {
            action: 'add_dugnad',
            child_id: testChildId,
            type: 'sales',
            title: '__TEST_SALG__',
            deadline: '2026-12-31',
            notes: 'Testdugnad for salg',
        });
        assert(status === 201, `Expected 201, got ${status}`);
        assert(data.type === 'sales', 'Type mismatch');
        testDugnadSalesId = data.id;
    });

    // 4. add_dugnad (physical)
    await test('add_dugnad creates a physical dugnad', async () => {
        const { status, data } = await api('POST', {
            action: 'add_dugnad',
            child_id: testChildId,
            type: 'physical',
            title: '__TEST_FYSISK__',
        });
        assert(status === 201, `Expected 201, got ${status}`);
        testDugnadPhysicalId = data.id;
    });

    // 5. add_item
    await test('add_item adds an item to sales dugnad', async () => {
        const { status, data } = await api('POST', {
            action: 'add_item',
            dugnad_id: testDugnadSalesId,
            item_name: '__TEST_LODD__',
            price: 50,
            target_qty: 20,
        });
        assert(status === 201, `Expected 201, got ${status}`);
        assert(data.item_name === '__TEST_LODD__', 'Item name mismatch');
        assert(data.price === 50, 'Price mismatch');
        testItemId = data.id;
    });

    // 6. add_sale
    await test('add_sale registers a buyer', async () => {
        const { status, data } = await api('POST', {
            action: 'add_sale',
            item_id: testItemId,
            buyer_name: '__TEST_KJØPER__',
            quantity: 3,
            paid: false,
        });
        assert(status === 201, `Expected 201, got ${status}`);
        assert(data.buyer_name === '__TEST_KJØPER__', 'Buyer mismatch');
        assert(data.quantity === 3, 'Quantity mismatch');
        assert(data.paid === false, 'Should not be paid');
        testSaleId = data.id;
    });

    // 7. update_sale (mark paid)
    await test('update_sale marks as paid', async () => {
        const { status, data } = await api('POST', {
            action: 'update_sale',
            id: testSaleId,
            paid: true,
        });
        assert(status === 200, `Expected 200, got ${status}`);
        assert(data.ok === true, 'Expected ok');
    });

    // 8. add_task
    await test('add_task adds a physical task', async () => {
        const { status, data } = await api('POST', {
            action: 'add_task',
            dugnad_id: testDugnadPhysicalId,
            task_name: '__TEST_VAKT__',
            task_date: '2026-06-01',
            notes: 'Testvakt',
        });
        assert(status === 201, `Expected 201, got ${status}`);
        assert(data.task_name === '__TEST_VAKT__', 'Task name mismatch');
        testTaskId = data.id;
    });

    // 9. update_task (mark completed)
    await test('update_task marks completed', async () => {
        const { status, data } = await api('POST', {
            action: 'update_task',
            id: testTaskId,
            completed: true,
        });
        assert(status === 200, `Expected 200, got ${status}`);
    });

    // 10. GET all data — verify relations
    await test('GET returns nested data with relations', async () => {
        const { status, data } = await api('GET');
        assert(status === 200, `Expected 200, got ${status}`);
        assert(Array.isArray(data.children), 'Missing children array');
        assert(Array.isArray(data.dugnads), 'Missing dugnads array');

        const testChild = data.children.find(c => c.name === '__TEST_BARN__');
        assert(testChild, 'Test child not found');

        const salesD = data.dugnads.find(d => d.id === testDugnadSalesId);
        assert(salesD, 'Sales dugnad not found');
        assert(salesD.items.length > 0, 'No items on sales dugnad');
        const item = salesD.items.find(i => i.id === testItemId);
        assert(item, 'Test item not found');
        assert(item.sales.length > 0, 'No sales on item');
        const sale = item.sales.find(s => s.id === testSaleId);
        assert(sale, 'Test sale not found');
        assert(sale.paid === true, 'Sale should be paid');

        const physD = data.dugnads.find(d => d.id === testDugnadPhysicalId);
        assert(physD, 'Physical dugnad not found');
        assert(physD.tasks.length > 0, 'No tasks on physical dugnad');
        const task = physD.tasks.find(t => t.id === testTaskId);
        assert(task, 'Test task not found');
        assert(task.completed === true, 'Task should be completed');
    });

    // 11. validation test
    await test('add_dugnad rejects missing fields', async () => {
        const { status, data } = await api('POST', { action: 'add_dugnad', child_id: testChildId });
        assert(status === 400, `Expected 400, got ${status}`);
        assert(data.error.includes('title'), 'Should mention missing title');
    });

    // ── Cleanup ──
    console.log('\n  🧹 Cleaning up test data...');

    await test('delete_dugnad cascades items+sales', async () => {
        const { status } = await api('POST', { action: 'delete_dugnad', id: testDugnadSalesId });
        assert(status === 200, 'Failed to delete sales dugnad');
    });

    await test('delete physical dugnad cascades tasks', async () => {
        const { status } = await api('POST', { action: 'delete_dugnad', id: testDugnadPhysicalId });
        assert(status === 200, 'Failed to delete physical dugnad');
    });

    await test('delete test child', async () => {
        const { status } = await api('POST', { action: 'delete_child', id: testChildId });
        assert(status === 200, 'Failed to delete test child');
    });

    await test('verify cleanup — test data gone', async () => {
        const { data } = await api('GET');
        const testChild = data.children.find(c => c.name === '__TEST_BARN__');
        assert(!testChild, 'Test child still exists!');
        const testDugnad = data.dugnads.find(d => d.title === '__TEST_SALG__' || d.title === '__TEST_FYSISK__');
        assert(!testDugnad, 'Test dugnad still exists!');
    });

    // ── Summary ──
    console.log(`\n${'═'.repeat(40)}`);
    console.log(`  ${passed + failed} tests: ${passed} passed, ${failed} failed`);
    console.log(`${'═'.repeat(40)}\n`);

    process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
