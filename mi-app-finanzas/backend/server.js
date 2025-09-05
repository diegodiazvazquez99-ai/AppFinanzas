const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Crear directorio data si no existe
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

// Conexión a base de datos SQLite
const db = new sqlite3.Database(path.join(dataDir, 'finanzas.db'));

// Crear tablas
db.serialize(() => {
    // Tabla de cuentas
    db.run(`CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL DEFAULT 0,
        color TEXT,
        icon TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de categorías
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de transacciones
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        account_id INTEGER,
        category_id INTEGER,
        date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts (id),
        FOREIGN KEY (category_id) REFERENCES categories (id)
    )`);

    // Insertar categorías por defecto
    db.get("SELECT COUNT(*) as count FROM categories", (err, row) => {
        if (row.count === 0) {
            const defaultCategories = [
                // Ingresos
                { name: 'Salario', type: 'income', icon: 'briefcase', color: '#10b981' },
                { name: 'Freelance', type: 'income', icon: 'laptop', color: '#06b6d4' },
                { name: 'Inversiones', type: 'income', icon: 'trending-up', color: '#8b5cf6' },
                { name: 'Otros ingresos', type: 'income', icon: 'plus-circle', color: '#22c55e' },
                
                // Gastos
                { name: 'Alimentación', type: 'expense', icon: 'utensils', color: '#ef4444' },
                { name: 'Transporte', type: 'expense', icon: 'car', color: '#f59e0b' },
                { name: 'Vivienda', type: 'expense', icon: 'home', color: '#3b82f6' },
                { name: 'Salud', type: 'expense', icon: 'heart', color: '#ec4899' },
                { name: 'Entretenimiento', type: 'expense', icon: 'film', color: '#a855f7' },
                { name: 'Educación', type: 'expense', icon: 'book', color: '#6366f1' },
                { name: 'Ropa', type: 'expense', icon: 'shirt', color: '#14b8a6' },
                { name: 'Otros gastos', type: 'expense', icon: 'minus-circle', color: '#f87171' }
            ];

            const stmt = db.prepare("INSERT INTO categories (name, type, icon, color) VALUES (?, ?, ?, ?)");
            defaultCategories.forEach(cat => {
                stmt.run(cat.name, cat.type, cat.icon, cat.color);
            });
            stmt.finalize();
        }
    });
});

// RUTAS API

// Obtener todas las cuentas
app.get('/api/accounts', (req, res) => {
    db.all("SELECT * FROM accounts ORDER BY created_at DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Crear cuenta
app.post('/api/accounts', (req, res) => {
    const { name, type, balance, color, icon } = req.body;
    db.run(
        "INSERT INTO accounts (name, type, balance, color, icon) VALUES (?, ?, ?, ?, ?)",
        [name, type, balance || 0, color, icon],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, ...req.body });
        }
    );
});

// Obtener todas las categorías
app.get('/api/categories', (req, res) => {
    db.all("SELECT * FROM categories ORDER BY name", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Obtener transacciones
app.get('/api/transactions', (req, res) => {
    const query = `
        SELECT 
            t.*,
            a.name as account_name,
            c.name as category_name,
            c.icon as category_icon,
            c.color as category_color
        FROM transactions t
        LEFT JOIN accounts a ON t.account_id = a.id
        LEFT JOIN categories c ON t.category_id = c.id
        ORDER BY t.date DESC, t.created_at DESC
        LIMIT 100
    `;
    
    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Crear transacción
app.post('/api/transactions', (req, res) => {
    const { type, amount, description, account_id, category_id, date } = req.body;
    
    db.run(
        "INSERT INTO transactions (type, amount, description, account_id, category_id, date) VALUES (?, ?, ?, ?, ?, ?)",
        [type, amount, description, account_id, category_id, date],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            // Actualizar balance de la cuenta
            const balanceChange = type === 'income' ? amount : -amount;
            db.run(
                "UPDATE accounts SET balance = balance + ? WHERE id = ?",
                [balanceChange, account_id],
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ id: this.lastID, ...req.body });
                }
            );
        }
    );
});

// Obtener estadísticas
app.get('/api/stats', (req, res) => {
    const stats = {};
    
    // Total de cuentas y balance general
    db.get("SELECT COUNT(*) as total_accounts, SUM(balance) as total_balance FROM accounts", (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalAccounts = row.total_accounts;
        stats.totalBalance = row.total_balance || 0;
        
        // Ingresos del mes
        const currentMonth = new Date().toISOString().slice(0, 7);
        db.get(
            "SELECT SUM(amount) as total FROM transactions WHERE type = 'income' AND date LIKE ?",
            [`${currentMonth}%`],
            (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.monthlyIncome = row.total || 0;
                
                // Gastos del mes
                db.get(
                    "SELECT SUM(amount) as total FROM transactions WHERE type = 'expense' AND date LIKE ?",
                    [`${currentMonth}%`],
                    (err, row) => {
                        if (err) return res.status(500).json({ error: err.message });
                        stats.monthlyExpense = row.total || 0;
                        res.json(stats);
                    }
                );
            }
        );
    });
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en puerto ${PORT}`);
});