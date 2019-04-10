// loads all dependencies
let express = require('express');
let app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

// Creating TABLE menusection
let query1 = 'CREATE TABLE IF NOT EXISTS menusection (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) UNIQUE)';
db.all(query1);


// sets path to get all menu sections
app.get('/menusection', function(request,response) {
    let result = {"menusection": []};
    db.all("SELECT * FROM menusection", function(err, rows) {
        rows.forEach(function (row) {
            result.menusection.push({
                "id": row.id,
                "name": row.name
            });
        })
        return response.json(result);
    });	
    
});

//sets path to get a specific menu section by id
app.get('/menusection/:id', function (request, response) { 
    let id = request.params.id;
    db.get('SELECT * FROM menusection WHERE id=?', [id], function(err,row){
        if (err){
            return console.log(err.message);
        }
        if (row == undefined){
            return response.json({
                "message": "this id doesnt exist"
            })
        }
        let retObject = {
            "MenuSection": [
                {
                    "id": row.id,
                    "name": row.name
                }
            ]
        }
        return response.json(retObject);
    });
});

//allows you to put a new item into the database. normally I would use a post request
// but the instructions given specified put so I used this
app.put('/menusection', function (request,response){
    let name = request.body.name;
    db.run(`INSERT INTO menusection(name) VALUES(?)`, [name], function(err) {
        if (err) {
          return console.log(err.message);
        }
    });
    
    db.get('SELECT * FROM menusection WHERE name=?', [name], function(err,row){
        if (err){
            return console.log(err.message);
        }
        let retObject = {
            "success": true,
            "MenuSection": [
                {
                    "id": row.id,
                    "name": name
                }
            ]
        }
        return response.json(retObject);
    });


});

//creates a route to change an already existing item using id
app.post('/menusection/:id', function(request,response){
    let id = request.params.id;
    let name = request.body.name;
    db.run('UPDATE menusection SET name = ? WHERE id = ?', [name, id], function(err){
        if (err) {
            return console.log(err.message);
        }
    });

    let retObject = {
        "success": true,
        "MenuSection": [
            {
                "id": id,
                "name": name
            }
        ]
    }

    return response.json(retObject);
});

// sets up a route to delete a menusection according to ID
app.delete('/menusection/:id', function(request,response){
    let id = request.params.id;
    db.run('DELETE FROM menusection WHERE id=?', [id], function(err){
        if (err) {
            return console.log(err.message);
        }
    });

    return response.json({
        "success": true
    });
});


app.listen(8080, function (error, response) {
    console.log('Server started');
});
