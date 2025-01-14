// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors')

const app = express();
const PORT = 3000;

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Path to the mock JSON file
const dataFilePath = path.join(__dirname, './response_1736439082756.json');

// Utility function to read data from the JSON file
const readData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data file:', err);
    return [];
  }
};

const getRecords = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse({"records": data.records});
  } catch (err) {
    console.error('Error reading data file:', err);
    return [];
  }
};

// Utility function to write data to the JSON file
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to data file:', err);
  }
};

// Endpoint to fetch all data
app.get('/api/data', (req, res) => {
  const data = readData();
  res.json(data);
});

app.get('/api/records', (req, res) => {
  const data = getRecords();
  res.json(data);
});

// Endpoint to fetch a single item by ID
app.get('/api/data/:id', (req, res) => {
  const data = readData();
  const item = data.find((d) => d.id === parseInt(req.params.id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Endpoint to add a new item
app.post('/api/data', (req, res) => {
  const data = readData();
  const newItem = { id: Date.now(), ...req.body };
  data.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// Endpoint to update an item by ID
app.put('/api/data/:id', (req, res) => {
  const data = readData();
  const index = data.findIndex((d) => d.id === parseInt(req.params.id));
  if (index !== -1) {
    data[index] = { ...data[index], ...req.body };
    writeData(data);
    res.json(data[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Endpoint to delete an item by ID
app.delete('/api/data/:id', (req, res) => {
  const data = readData();
  const newData = data.filter((d) => d.id !== parseInt(req.params.id));
  if (newData.length !== data.length) {
    writeData(newData);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock server is running on http://localhost:${PORT}`);
});
