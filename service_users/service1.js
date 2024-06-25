const express = require('express');
const {Sequelize, DataTypes} = require("sequelize");
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT1 || 3001;

const sequelize = new Sequelize(process.env.DB_URL);

// Scheme
const User = sequelize.define("User", {
    name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    lastName : {
        type : DataTypes.STRING,
        allowNull : false,
    }, 
    age : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    gender : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    problems : {
        type : DataTypes.BOOLEAN,
        allowNull : false,
    },
})
// Синхранизуем каждый раз при запуске
sequelize.sync().then (() => {
    console.log("created");
})

// Сервак
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("Test-tasks");
})


// Endpoint 1
app.post('/create', async (req, res) => {
    const {name, lastName, age, gender, problems} = req.body;
    try {
        const user = await User.create({name, lastName, age, gender, problems});

        await axios.post(`http://localhost:${process.env.PORT2}/historyCreate`, {
            userId : user.id,
            action : "created",
        });
        res.status(200).send(user);
    } catch(e) {
        res.status(400);
    }
})
// Endpoint 2
app.put('/userUpdate/:id', async (req, res) => {
    const { id } = req.params;
    const {name, lastName, age, gender, problems} = req.body;

    try {
        const user = await User.findByPk(id);
        if(!user) {
            res.status(404).send("Not found");
        }
        user.name = name;
        user.lastName = lastName;
        user.age = age;
        user.gender = gender;
        user.problems = problems;

        await user.save();

        await axios.post(`http://localhost:${process.env.PORT2}/historyCreate`, {
            userId : user.id,
            action : "updated",
        })

        res.status(200).send(user);

    } catch (e) {   
        res.status(400);
    }
});


// Endpoint 3
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.listen(port, () => {
    console.log(`User-service work on ${port} port`)
})