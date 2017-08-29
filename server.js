var express = require('express');
var bookRouter = express.Router();
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


//connect with db using local mongo db server
//the db mean100516 is hosted locally in my imac and has been populated manually
mongoose.connect('mongodb://localhost/mean100516');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error'));
db.once('open', function() {
    console.log('db connected');
});


//create db schema
var bookSchema = mongoose.Schema({
    title: String
});

var Book = mongoose.model('Book', bookSchema);

//instantiate express app
var app = express();


//set middleware to log operations
app.use(logger('dev'));

//set middleware to get json data in routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set express router
app.use('/api/books', bookRouter);


//read all: get all books
bookRouter.route('/')
    .get(function(req, res) {
       Book.find(function(err, data) {
           if(err) {
               res.status(404).send(err);
           } else {
               res.json(data);
           }
       })
    })

//create: post one book
    .post(function(req, res) {
      console.log(req.body);
      var book = new Book(req.body);
      console.log(book);
      book.save();
      res.status(201).send(book);
    });


//read one: get one book
bookRouter.route('/:bookId')
    .get(function(req, res) {
       Book.findById(req.params.bookId, function(err, data) {
           if(err) {
               res.status(500).send(err);
           } else {
               res.status(201).send(data);
           }
       });
    })

//update: update one book
    .put(function(req, res) {
       Book.findById(req.params.bookId, function(err, data) {
           if(err) {
               res.status(404).send(err);
           } else {
               data.title = req.body.title;
               data.save(function(err) {
                   if(err) {
                       res.status(500).send(err);
                   } else {
                       res.status(201).send(data);
                   }
               });
           }

       });
    })

//delete: delete one book
    .delete(function(req, res) {
       Book.findById(req.params.bookId, function(err, data) {
           data.remove(function(err) {
               if(err) {
                   res.status(500).send(err);
               } else {
                   res.status(204).send("item removed");
               }
           });
       })
    });


//route for index.html
app.get('/', function(req, res) {
    res.send('hello world');
});


//port
var port = process.env.PORT || 3000;


//activate server
app.listen(port, function() {
    console.log('server listening on port ' + port);
});
