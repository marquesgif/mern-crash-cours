import mongoose from "mongoose"
/* import dotenv from 'dotenv';
dotenv.config(); */

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Conexão: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Erro: ${error.message}`);
        process.exit(1)
    }
}
