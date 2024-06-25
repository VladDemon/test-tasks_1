import { Sequelize, DataTypes } from "sequelize";

const express = require('express');

const axios = require('axios');
const dotenv = require('dotenv');

const { request: Req } = require('express');
const { response: Res } = require('express');

dotenv.config();

const port = process.env.PORT2;

const app = express();
app.use(express.json());

const sequelize = new Sequelize(process.env.DB_HISTORY_URL);


const UserHistory = sequelize.define("UserHistory", {
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    action : {
        type : DataTypes.STRING,
        allowNull : false,
    }
})


sequelize.sync().then ( () => {
    console.log("Created history");
} );

app.get('/', async (req : typeof Req, res : typeof Res) => {
    res.send("Hello");
})


app.post('/historyCreate', async (req : typeof Req, res : typeof Res) => {
    const { userId, action } = req.body; 
    try {
        const newHistory = await UserHistory.create({userId, action});
        res.send(newHistory);
    } catch(e) {
        res.status(400).send(e);
    }
    console.log(req)
})

app.get('/history', async (req: typeof Req, res : typeof Res) => {
    const { userId, page = '1', pageSize = '10' } = req.query;
    const limit = parseInt(pageSize as string);
    const offset = (parseInt(page as string) - 1) * limit;
    try {
      const history = await UserHistory.findAll({
        where: userId ? { userId: parseInt(userId as string) } : undefined,
        limit,
        offset
      });
      res.status(200).send(history);
    } catch (error) {
      res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`User-service-history work on ${port} port`)
})