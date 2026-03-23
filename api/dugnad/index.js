const { getConnection, executeQuery, TYPES } = require('../shared/db');

// ── Schema + seed ──
const INIT_SQL = `
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'dm_children')
CREATE TABLE dm_children (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    team NVARCHAR(50),
    created_at DATETIME2 DEFAULT GETDATE()
);

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'dm_dugnads')
CREATE TABLE dm_dugnads (
    id INT IDENTITY(1,1) PRIMARY KEY,
    child_id INT NOT NULL,
    type NVARCHAR(20) NOT NULL,
    title NVARCHAR(200) NOT NULL,
    deadline DATE,
    status NVARCHAR(20) DEFAULT 'active',
    notes NVARCHAR(500),
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_dugnad_child FOREIGN KEY (child_id) REFERENCES dm_children(id)
);

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'dm_dugnad_items')
CREATE TABLE dm_dugnad_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    dugnad_id INT NOT NULL,
    item_name NVARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    target_qty INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_item_dugnad FOREIGN KEY (dugnad_id) REFERENCES dm_dugnads(id) ON DELETE CASCADE
);

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'dm_sales')
CREATE TABLE dm_sales (
    id INT IDENTITY(1,1) PRIMARY KEY,
    item_id INT NOT NULL,
    buyer_name NVARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    paid BIT DEFAULT 0,
    paid_date DATE,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_sale_item FOREIGN KEY (item_id) REFERENCES dm_dugnad_items(id) ON DELETE CASCADE
);

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'dm_tasks')
CREATE TABLE dm_tasks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    dugnad_id INT NOT NULL,
    task_name NVARCHAR(200) NOT NULL,
    task_date DATE,
    completed BIT DEFAULT 0,
    notes NVARCHAR(500),
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_task_dugnad FOREIGN KEY (dugnad_id) REFERENCES dm_dugnads(id) ON DELETE CASCADE
);
`;

const SEED_CHILDREN = `
IF NOT EXISTS (SELECT 1 FROM dm_children WHERE name = 'Osvald')
    INSERT INTO dm_children (name) VALUES ('Osvald');
IF NOT EXISTS (SELECT 1 FROM dm_children WHERE name = 'Eilif')
    INSERT INTO dm_children (name) VALUES ('Eilif');
IF NOT EXISTS (SELECT 1 FROM dm_children WHERE name = 'Gudmund')
    INSERT INTO dm_children (name) VALUES ('Gudmund');
IF NOT EXISTS (SELECT 1 FROM dm_children WHERE name = N'Gunnvår')
    INSERT INTO dm_children (name) VALUES (N'Gunnvår');
`;

// ── Helpers ──
function json(context, status, body) {
    context.res = { status, headers: { 'Content-Type': 'application/json' }, body };
}

function requiredFields(body, fields) {
    for (const f of fields) {
        if (body[f] === undefined || body[f] === null || body[f] === '') {
            return `Missing required field: ${f}`;
        }
    }
    return null;
}

// ── Main handler ──
module.exports = async function (context, req) {
    let connection;
    try {
        connection = await getConnection();

        if (req.method === 'GET') {
            return await handleGet(context, connection);
        }
        if (req.method === 'POST') {
            return await handlePost(context, req, connection);
        }
        if (req.method === 'DELETE') {
            return await handleDelete(context, req, connection);
        }
        json(context, 405, { error: 'Method not allowed' });
    } catch (err) {
        json(context, 500, { error: err.message });
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};

// ── GET: return all data ──
async function handleGet(context, conn) {
    const children = await executeQuery(conn, 'SELECT * FROM dm_children ORDER BY name');
    const dugnads = await executeQuery(conn, 'SELECT * FROM dm_dugnads ORDER BY created_at DESC');
    const items = await executeQuery(conn, 'SELECT * FROM dm_dugnad_items ORDER BY id');
    const sales = await executeQuery(conn, 'SELECT * FROM dm_sales ORDER BY created_at DESC');
    const tasks = await executeQuery(conn, 'SELECT * FROM dm_tasks ORDER BY task_date');

    // Nest items+sales into dugnads, tasks into dugnads
    const itemMap = {};
    items.forEach(item => {
        if (!itemMap[item.dugnad_id]) itemMap[item.dugnad_id] = [];
        itemMap[item.dugnad_id].push({ ...item, sales: [] });
    });
    sales.forEach(sale => {
        for (const dugnadItems of Object.values(itemMap)) {
            const item = dugnadItems.find(i => i.id === sale.item_id);
            if (item) { item.sales.push(sale); break; }
        }
    });

    const taskMap = {};
    tasks.forEach(t => {
        if (!taskMap[t.dugnad_id]) taskMap[t.dugnad_id] = [];
        taskMap[t.dugnad_id].push(t);
    });

    const enrichedDugnads = dugnads.map(d => ({
        ...d,
        items: itemMap[d.id] || [],
        tasks: taskMap[d.id] || [],
    }));

    json(context, 200, { children, dugnads: enrichedDugnads });
}

// ── POST: create/update actions ──
async function handlePost(context, req, conn) {
    const body = req.body || {};
    const { action } = body;

    switch (action) {
        case 'init_db': {
            await executeQuery(conn, INIT_SQL);
            await executeQuery(conn, SEED_CHILDREN);
            json(context, 200, { ok: true, message: 'Database initialized' });
            break;
        }

        case 'add_child': {
            const err = requiredFields(body, ['name']);
            if (err) return json(context, 400, { error: err });
            const rows = await executeQuery(conn,
                'INSERT INTO dm_children (name, team) OUTPUT INSERTED.* VALUES (@name, @team)',
                [
                    { name: 'name', type: TYPES.NVarChar, value: body.name },
                    { name: 'team', type: TYPES.NVarChar, value: body.team || null },
                ]);
            json(context, 201, rows[0]);
            break;
        }

        case 'update_child': {
            const err = requiredFields(body, ['id', 'name']);
            if (err) return json(context, 400, { error: err });
            await executeQuery(conn,
                'UPDATE dm_children SET name = @name, team = @team WHERE id = @id',
                [
                    { name: 'id', type: TYPES.Int, value: body.id },
                    { name: 'name', type: TYPES.NVarChar, value: body.name },
                    { name: 'team', type: TYPES.NVarChar, value: body.team || null },
                ]);
            json(context, 200, { ok: true });
            break;
        }

        case 'delete_child': {
            const err = requiredFields(body, ['id']);
            if (err) return json(context, 400, { error: err });
            await executeQuery(conn, 'DELETE FROM dm_children WHERE id = @id',
                [{ name: 'id', type: TYPES.Int, value: body.id }]);
            json(context, 200, { ok: true });
            break;
        }

        case 'add_dugnad': {
            const err = requiredFields(body, ['child_id', 'type', 'title']);
            if (err) return json(context, 400, { error: err });
            const rows = await executeQuery(conn,
                `INSERT INTO dm_dugnads (child_id, type, title, deadline, notes)
                 OUTPUT INSERTED.*
                 VALUES (@child_id, @type, @title, @deadline, @notes)`,
                [
                    { name: 'child_id', type: TYPES.Int, value: body.child_id },
                    { name: 'type', type: TYPES.NVarChar, value: body.type },
                    { name: 'title', type: TYPES.NVarChar, value: body.title },
                    { name: 'deadline', type: TYPES.Date, value: body.deadline || null },
                    { name: 'notes', type: TYPES.NVarChar, value: body.notes || null },
                ]);
            json(context, 201, rows[0]);
            break;
        }

        case 'update_dugnad': {
            const err = requiredFields(body, ['id']);
            if (err) return json(context, 400, { error: err });
            const sets = [];
            const params = [{ name: 'id', type: TYPES.Int, value: body.id }];
            if (body.title !== undefined) { sets.push('title = @title'); params.push({ name: 'title', type: TYPES.NVarChar, value: body.title }); }
            if (body.deadline !== undefined) { sets.push('deadline = @deadline'); params.push({ name: 'deadline', type: TYPES.Date, value: body.deadline || null }); }
            if (body.status !== undefined) { sets.push('status = @status'); params.push({ name: 'status', type: TYPES.NVarChar, value: body.status }); }
            if (body.notes !== undefined) { sets.push('notes = @notes'); params.push({ name: 'notes', type: TYPES.NVarChar, value: body.notes || null }); }
            if (sets.length === 0) return json(context, 400, { error: 'Nothing to update' });
            await executeQuery(conn, `UPDATE dm_dugnads SET ${sets.join(', ')} WHERE id = @id`, params);
            json(context, 200, { ok: true });
            break;
        }

        case 'delete_dugnad': {
            const err = requiredFields(body, ['id']);
            if (err) return json(context, 400, { error: err });
            await executeQuery(conn, 'DELETE FROM dm_dugnads WHERE id = @id',
                [{ name: 'id', type: TYPES.Int, value: body.id }]);
            json(context, 200, { ok: true });
            break;
        }

        case 'add_item': {
            const err = requiredFields(body, ['dugnad_id', 'item_name', 'price', 'target_qty']);
            if (err) return json(context, 400, { error: err });
            const rows = await executeQuery(conn,
                `INSERT INTO dm_dugnad_items (dugnad_id, item_name, price, target_qty)
                 OUTPUT INSERTED.*
                 VALUES (@dugnad_id, @item_name, @price, @target_qty)`,
                [
                    { name: 'dugnad_id', type: TYPES.Int, value: body.dugnad_id },
                    { name: 'item_name', type: TYPES.NVarChar, value: body.item_name },
                    { name: 'price', type: TYPES.Decimal, value: body.price },
                    { name: 'target_qty', type: TYPES.Int, value: body.target_qty },
                ]);
            json(context, 201, rows[0]);
            break;
        }

        case 'update_item': {
            const err = requiredFields(body, ['id']);
            if (err) return json(context, 400, { error: err });
            const sets = [];
            const params = [{ name: 'id', type: TYPES.Int, value: body.id }];
            if (body.item_name !== undefined) { sets.push('item_name = @item_name'); params.push({ name: 'item_name', type: TYPES.NVarChar, value: body.item_name }); }
            if (body.price !== undefined) { sets.push('price = @price'); params.push({ name: 'price', type: TYPES.Decimal, value: body.price }); }
            if (body.target_qty !== undefined) { sets.push('target_qty = @target_qty'); params.push({ name: 'target_qty', type: TYPES.Int, value: body.target_qty }); }
            if (sets.length === 0) return json(context, 400, { error: 'Nothing to update' });
            await executeQuery(conn, `UPDATE dm_dugnad_items SET ${sets.join(', ')} WHERE id = @id`, params);
            json(context, 200, { ok: true });
            break;
        }

        case 'delete_item': {
            const err = requiredFields(body, ['id']);
            if (err) return json(context, 400, { error: err });
            await executeQuery(conn, 'DELETE FROM dm_dugnad_items WHERE id = @id',
                [{ name: 'id', type: TYPES.Int, value: body.id }]);
            json(context, 200, { ok: true });
            break;
        }

        case 'add_sale': {
            const err = requiredFields(body, ['item_id', 'buyer_name']);
            if (err) return json(context, 400, { error: err });
            const rows = await executeQuery(conn,
                `INSERT INTO dm_sales (item_id, buyer_name, quantity, paid)
                 OUTPUT INSERTED.*
                 VALUES (@item_id, @buyer_name, @quantity, @paid)`,
                [
                    { name: 'item_id', type: TYPES.Int, value: body.item_id },
                    { name: 'buyer_name', type: TYPES.NVarChar, value: body.buyer_name },
                    { name: 'quantity', type: TYPES.Int, value: body.quantity || 1 },
                    { name: 'paid', type: TYPES.Bit, value: body.paid ? 1 : 0 },
                ]);
            json(context, 201, rows[0]);
            break;
        }

        case 'update_sale': {
            const err = requiredFields(body, ['id']);
            if (err) return json(context, 400, { error: err });
            const sets = [];
            const params = [{ name: 'id', type: TYPES.Int, value: body.id }];
            if (body.buyer_name !== undefined) { sets.push('buyer_name = @buyer_name'); params.push({ name: 'buyer_name', type: TYPES.NVarChar, value: body.buyer_name }); }
            if (body.quantity !== undefined) { sets.push('quantity = @quantity'); params.push({ name: 'quantity', type: TYPES.Int, value: body.quantity }); }
            if (body.paid !== undefined) {
                sets.push('paid = @paid');
                params.push({ name: 'paid', type: TYPES.Bit, value: body.paid ? 1 : 0 });
                sets.push('paid_date = @paid_date');
                params.push({ name: 'paid_date', type: TYPES.Date, value: body.paid ? new Date().toISOString().split('T')[0] : null });
            }
            if (sets.length === 0) return json(context, 400, { error: 'Nothing to update' });
            await executeQuery(conn, `UPDATE dm_sales SET ${sets.join(', ')} WHERE id = @id`, params);
            json(context, 200, { ok: true });
            break;
        }

        case 'delete_sale': {
            const err = requiredFields(body, ['id']);
            if (err) return json(context, 400, { error: err });
            await executeQuery(conn, 'DELETE FROM dm_sales WHERE id = @id',
                [{ name: 'id', type: TYPES.Int, value: body.id }]);
            json(context, 200, { ok: true });
            break;
        }

        case 'add_task': {
            const err = requiredFields(body, ['dugnad_id', 'task_name']);
            if (err) return json(context, 400, { error: err });
            const rows = await executeQuery(conn,
                `INSERT INTO dm_tasks (dugnad_id, task_name, task_date, notes)
                 OUTPUT INSERTED.*
                 VALUES (@dugnad_id, @task_name, @task_date, @notes)`,
                [
                    { name: 'dugnad_id', type: TYPES.Int, value: body.dugnad_id },
                    { name: 'task_name', type: TYPES.NVarChar, value: body.task_name },
                    { name: 'task_date', type: TYPES.Date, value: body.task_date || null },
                    { name: 'notes', type: TYPES.NVarChar, value: body.notes || null },
                ]);
            json(context, 201, rows[0]);
            break;
        }

        case 'update_task': {
            const err = requiredFields(body, ['id']);
            if (err) return json(context, 400, { error: err });
            const sets = [];
            const params = [{ name: 'id', type: TYPES.Int, value: body.id }];
            if (body.task_name !== undefined) { sets.push('task_name = @task_name'); params.push({ name: 'task_name', type: TYPES.NVarChar, value: body.task_name }); }
            if (body.task_date !== undefined) { sets.push('task_date = @task_date'); params.push({ name: 'task_date', type: TYPES.Date, value: body.task_date || null }); }
            if (body.completed !== undefined) { sets.push('completed = @completed'); params.push({ name: 'completed', type: TYPES.Bit, value: body.completed ? 1 : 0 }); }
            if (body.notes !== undefined) { sets.push('notes = @notes'); params.push({ name: 'notes', type: TYPES.NVarChar, value: body.notes || null }); }
            if (sets.length === 0) return json(context, 400, { error: 'Nothing to update' });
            await executeQuery(conn, `UPDATE dm_tasks SET ${sets.join(', ')} WHERE id = @id`, params);
            json(context, 200, { ok: true });
            break;
        }

        case 'delete_task': {
            const err = requiredFields(body, ['id']);
            if (err) return json(context, 400, { error: err });
            await executeQuery(conn, 'DELETE FROM dm_tasks WHERE id = @id',
                [{ name: 'id', type: TYPES.Int, value: body.id }]);
            json(context, 200, { ok: true });
            break;
        }

        default:
            json(context, 400, { error: `Unknown action: ${action}` });
    }
}

// ── DELETE method (convenience alias) ──
async function handleDelete(context, req, conn) {
    const entity = req.query.entity;
    const id = parseInt(req.query.id);
    if (!entity || !id) return json(context, 400, { error: 'Missing entity or id query params' });

    const tableMap = {
        child: 'dm_children',
        dugnad: 'dm_dugnads',
        item: 'dm_dugnad_items',
        sale: 'dm_sales',
        task: 'dm_tasks',
    };
    const table = tableMap[entity];
    if (!table) return json(context, 400, { error: `Unknown entity: ${entity}` });

    await executeQuery(conn, `DELETE FROM ${table} WHERE id = @id`,
        [{ name: 'id', type: TYPES.Int, value: id }]);
    json(context, 200, { ok: true });
}
