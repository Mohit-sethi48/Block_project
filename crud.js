// crud.js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // to parse JSON bodies

// In-memory "database"
let items = []; 

// CREATE: Add a new item
app.post('/items', (req, res) => {
  const { name } = req.body;
  const id = items.length + 1;
  const newItem = { id, name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// READ: Get all items
app.get('/', (req, res) => {
    res.send('Server is running 🚀');
});

// UPDATE: Update an item by id
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  item.name = name;
  res.json(item);
});

// DELETE: Remove an item by id
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  const deleted = items.splice(index, 1);
  res.json(deleted[0]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
