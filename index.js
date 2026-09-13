import express from 'express';
import supabase from './models/db.js';
import cakesRoutes from './routes/cakes.js';
import ordersRoutes from './routes/orders.js';
import customersRoutes from './routes/customers.js';

const app = express();
app.use(express.json());
app.use('/api/cakes', cakesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/customers', customersRoutes);

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    try {
        return res.status(200).json({
            status:'UP',
        })

    } catch(error) {
        return res.status(500).json({
            status: 'DOWN',
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})