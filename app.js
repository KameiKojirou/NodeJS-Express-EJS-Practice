const sqlite3 = require('sqlite3');
const express = require("express");
const path = require('path');
const ejs = require('ejs');
var app = express();
app.set('view engine', 'ejs');


const HTTP_PORT = 8002
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

const db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
        console.error("Erro opening database " + err.message);
    } else {

        db.run('CREATE TABLE employees( \
            employee_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            last_name NVARCHAR(20)  NOT NULL,\
            first_name NVARCHAR(20)  NOT NULL,\
            title NVARCHAR(20),\
            address NVARCHAR(100),\
            country_code INTEGER\
        )', (err) => {
            if (err) {
                console.log("Table already exists.");
            }
            let insert = 'INSERT INTO employees (last_name, first_name, title, address, country_code) VALUES (?,?,?,?,?)';
            db.run(insert, ["Chandan", "Praveen", "SE", "Address 1", 1]);
            db.run(insert, ["Samanta", "Mohim", "SSE", "Address 2", 1]);
            db.run(insert, ["Gupta", "Pinky", "TL", "Address 3", 1]);
        });
    }
});

app.get('/', async (req, res) => {
    var data = await [ {hobby: 'playing football', name: 'doug'},
    {hobby: 'playing football', name: 'sally'},]
    var tagline = await 'This works!'
res.render('pages/index', {
        data:data,
        tagline:tagline
    });
});
app.get('/about', async (req, res) => {
    var data =  await [ {hobby: 'playing football', name: 'korgoth the barbarian'},
    {hobby: 'playing football', name: 'sally the archdruid'},]
    var tagline = await 'This works!'
res.render('pages/index', {
        data:data,
        tagline:tagline
    }); 
});

app.get('/sqlite3', (req, res, next) => {
        var params = [req.params.id]
        db.get(`SELECT * FROM employees where employee_id = 1`,[req.params.id], (err, row) => {
            results = row.first_name;
            next(results);
        });
        console.log(results);
        res.render('pages/results', {
            results:results
        });
});

app.get("/employees/:id", (req, res, next) => {
    var params = [req.params.id]
    db.each(`SELECT * FROM employees where employee_id = ?`, [req.params.id], (err, row) => {
        results = row.first_name;
        next(results);
    });
      console.log(results);
      res.render('pages/results', {
        results:results
    });
});
app.get("/employees2/:id", (req, res, next) => {
    var params = [req.params.id]
    db.each(`SELECT * FROM employees where employee_id = ?`, [req.params.id], (err, row) => {
        results = [{num: row.employee_id, name: row.first_name, last: row.last_name }];
        next(results);
    });
      console.log(results);
      res.render('pages/results2', {
        results:results
    });
});
app.get("/employees3", (req, res) => {
    var params = [req.params.id]
    var results = db.all(`SELECT * FROM employees`, (err, data) => {});
    console.log(data);
    res.render('pages/results3', {
        data:data
    });
});