console.log('Loading Server');

// HTTP STUFF
const WEB = '/home/ubuntu/workspace/students/web';

// Main requires
var express = require('express');
var fs = require('fs');

// load express middleware modules
var logger = require('morgan');
var compression = require('compression');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

// Makes an express app
var app = express();

// Insert middleware
app.use(logger('dev'));

app.use(compression());

app.use(favicon(WEB + '/img/favicon.ico'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// REST End Points go here

// Create
app.post('/api/v1/students', function(req, res) {
    var student = req.body;
    var id = student.id;
    var fpath = `${__dirname}/students/${id}.json`;
    
    if (student.displayYear) delete student.displayYear;
    if (student.sortableDate) delete student.sortableDate;
    if (student.displayName) delete student.displayName;
    delete student.id;
    
    student = JSON.stringify(student, null, 3);
        
    fs.exists(fpath, function(exists) {
        if (exists) {
            res.send("File already exists");
            console.log(`${fpath} already exists.`);
        }
        else {
            fs.writeFile(`${__dirname}/students/${id}.json`, student, 'utf8', function(err) {
              if (err) throw err;
              
              res.send("Success");
              console.log("Writing student");
            });
        }
    });
    
});

// Read
app.get('/api/v1/students/:id.json', function(req, res) {
    var id = req.params.id;
    fs.readFile(`${__dirname}/students/${id}.json`, 'utf8', function(err, data) {
        if (err) throw err;
        
        var student = JSON.parse(data);
        student = JSON.stringify(student, null, 3);
        
        res.json(student);
    });
});

// Update
app.put('/api/v1/students/:id.json', function(req, res) {
    var id = req.params.id;
    var student = req.body;
    
    if (student.displayYear) delete student.displayYear;
    if (student.sortableDate) delete student.sortableDate;
    if (student.displayName) delete student.displayName;
    delete student.id;
    
    student = JSON.stringify(student, null, 3);
    
    console.log(`Writing Student with id: ${id}`);
    
    fs.writeFile(`${__dirname}/students/${id}.json`, student, 'utf8', function(err) {
        if (err) throw err;
        
        res.json(student);
        console.log("Success");
    });
});

// Delete
app.delete('/api/v1/students/:id.json', function(req, res) {
    var id = req.params.id;
    var fpath = `${__dirname}/students/${id}.json`;
    
    fs.exists(fpath, function(exists) {
        if(exists) {
            fs.unlink(fpath);
            console.log(`${fpath} deleted`);
            res.send("Deleted");
        }
        else {
            console.log(`Couldn't find file: ${fpath}`);
            res.send("Error");
        }
    });
    
});

// List
app.get('/api/v1/students.json', function(req, res) {
    fs.readdir(__dirname + '/students', function(err, files) {
        if (err) throw err;
        
        var fileList = files.map(fileName => fileName.replace('.json', ''));
        
        res.json(fileList);
    });
});


// Traditional webserver stuff for serving static files
app.use(express.static(WEB));

// 404 statements must go last
app.get('*', function(req, res) {
    res.status(404).sendFile(WEB + '/404.html');
});

// Debug Info
console.log('Server Loaded');
console.log(WEB);

// Start listening
var server = app.listen(process.env.PORT, process.env.IP);


// ---------------------------- Shutdown Functions Used -----------------------------------

function gracefullShutdown() {
    console.log('\nStarting Shutdown');
    server.close(function() {
        console.log('\nShutdown Complete');
    });
}

process.on('SIGTERM', function() { // Terminate
    gracefullShutdown();
});

process.on('SIGINT', function() { // Ctrl+C (interrupt)
    gracefullShutdown();
});