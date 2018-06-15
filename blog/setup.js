var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');
//var mongo = require('mongodb').MongoClient;
//const mongoUrl = "mongodb://localhost:27017/hackathon";
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('db connected');
});

var peopleSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String
});
var People = mongoose.model('People', peopleSchema);

var articleSchema = mongoose.Schema({
    title: String,
    text: String,
    image: { data: Buffer, contentType: String },
    poster: String
});
var Article = mongoose.model('Article', articleSchema);


setupDB();


async function setupDB()
{
    await cleanup();
    await initialize();
    process.exit();
}

function cleanup()
{
    // clean previous data
    People.deleteMany({}, function (err) {
        if (err) return handleError(err);
    });
    Article.deleteMany({}, function (err) {
        if (err) return handleError(err);
    });
}

function initialize()
{
    // create an admin
    var pw='password';
    var admin = new People({ name: 'Admin', username: 'admin', password: pw });
    admin.save(function (err) {
        if (err) return handleError(err);
        // saved!
        console.log('admin saved')
        console.log(admin);   
    });

    var post = new Article({
        title: "Hello world!",
        text: "This is the very first post of this diary!",
        poster: "Admin"
    });
    post.save(function (err) {
        if (err) return handleError(err);
        // saved!
        console.log('post saved')  
    });
}