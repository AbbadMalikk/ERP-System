import express from 'express';
import Client from '../models/clientModel.js';
import ClientLedger from '../models/clientLedgerModel.js';
const router = express.Router();

// Route to handle adding a new client
router.post('/add-client', async (req, res) => {
    try {
        const { name, phoneNumber, address } = req.body;

        // Check if client already exists
        const existingClient = await Client.findOne({ $or: [{ name }, { phoneNumber }] });
        if (existingClient) {
            return res.status(400).json({ error: 'Client with this name or phone number already exists' });
        }

        // Create new client instance
        const newClient = new Client({
            name,
            phoneNumber,
            address,
        });

        // Save client to database
        await newClient.save();

        res.status(201).json({ message: 'Client added successfully!', client: newClient });
    } catch (error) {
        console.error('Error adding client:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//route to get clientByID
router.get('/getclientbyID/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.status(200).json(client);
    } catch (error) {
        console.error('Error fetching client:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all clients
router.get('/getclients', async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//clients with ledger
router.get('/getclientswithledger', async (req, res) => {
    try {
        const ledgers = await ClientLedger.find({}, 'clientId');
        res.status(200).json(ledgers);
    } catch (error) {
        console.error('Error fetching clients with ledger:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Route to handle updating a client
router.put('/update-client/:id', async (req, res) => {
    try {
        const { name, phoneNumber, address } = req.body;

        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            { name, phoneNumber, address },
            { new: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.status(200).json({ message: 'Client updated successfully!', client: updatedClient });
    } catch (error) {
        console.error('Error updating client:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/recent', async (req, res) => {
    try {
        const recentClients = await Client.find().sort({ _id: -1 }).limit(4);
        res.status(200).json(recentClients);
    } catch (error) {
        console.error('Error fetching recent clients:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle deleting a client
router.delete('/delete-client/:id', async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);

        if (!deletedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.status(200).json({ message: 'Client deleted successfully!' });
    } catch (error) {
        console.error('Error deleting client:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
