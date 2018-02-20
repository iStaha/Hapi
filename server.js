'use strict';

const Hapi = require('hapi');

const mongoose = require('mongoose');

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 8000
});


mongoose.connect('mongodb://localhost/peep');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('Connection with database succeeded.');
});


var peopleSchema = mongoose.Schema({
    name: String,
    gender: String
});

var People = mongoose.model('People', peopleSchema);

//console.log(Peep)


// Create the data store for the test API
var tasklist = [
    {
        "name": "Taha Latief",
        "age": "12",
        "gender": "Male"
    },
    {
        "name": "Nadeem",
        "age": "12",
        "gender": "Male"
    }
]

// Add the route


server.route([
    // Get ToDo List
    {
        method: 'GET',
        path: '/hello',
        handler: function (request, h) {


            //  var result = People.find();
            //console.log(result);

            /*  result.exec(function(err, pee) {
                   
                   console.log(pee) 
                   
                  
            })  */



            var peeps = People.find((err, peeps) => {
                console.log(peeps);
            });
            //   console.log(pe);

            const response = h.response(tasklist);
            response.type('text/plain');
            return response;

        }
    },

    // Get single task
    {
        method: 'GET',
        path: '/hello/{index}',
        handler: function (request, h) {
            console.log()

            People.findOne({ "name": request.params.index }, function (err, resad) {
                console.log(resad);
            });
            const response = h.response(tasklist);
            response.type('text/plain');
            return response;
        }
    },
    {
        method: 'POST',
        path: '/hello',
        handler: function (request, h) {
            //    newTask = {"task":request.payload.task, "owner":request.payload.owner};
            tasklist.push(request.payload);
            const newPeople = new People({
                'name': request.payload.name,
                'gender': request.payload.gender
            });
            const pay = request.payload;
            newPeople.save(function (err, newPeople) {
                console.log("Adding People");
                console.log(newPeople);
            });
            console.log(pay);

            const response = h.response(tasklist);
            response.type('application/json');
            return response.code(201);
        }
    },
    {
        method: 'DELETE',
        path: '/hello/{index}',
        handler: function (request, h) {
            People.findOneAndRemove({ name: request.params.index }, function (err, response) {
                if (!err) {
                    console.log("Deleted");
                }
            });
            const response = h.response(tasklist);
            response.type('application/json');
            return response.code(201);
        }
    },
    // Update single task
    {
        method: 'PUT',
        path: '/hello/{index}',
        handler: function (request, h) {
            // newTask = {"task":request.payload.task, "owner":request.payload.owner};
            var updateData = {
                'name': request.payload.name,
                'gender': request.payload.gender
            };
            console.log(request.params.index)

            People.findOneAndUpdate({ name: request.params.index },
                updateData,
                { new: true },
                function (err, doc) {
                    console.log("dvdv");
                    if (!err) {
                        console.log("Updated");
                    }
                });
            //      tasklist[request.params.index] = request.payload;
            const response = h.response(tasklist);
            response.type('application/json');
            return response;
        }
    },

]);
//  http POST  http://localhost:8000/hello  task="Eat Dinner" owner ="Taha"




// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();

/* 
var query   = { id: 8 }; 
var update  = { title: "new title" }; 
var options = { new: true }; 
MyModel.findOneAndUpdate(query, update, options, function(err, doc){ 
 
 
}); */