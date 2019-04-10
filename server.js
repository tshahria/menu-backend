let express = require('express');
let app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

// Creating TABLE messages

let query1 = 'CREATE TABLE IF NOT EXISTS menusection (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) UNIQUE)';
db.all(query1);

app.get('/menusection', function(request,response) {
    let result = {"menusection": []};
    db.all("SELECT * FROM menusection", function(err, rows) {
        rows.forEach(function (row) {
            result.menusection.append({
                "id": row.id,
                "name": row.sectionName
            });
        })
	});	
});

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
