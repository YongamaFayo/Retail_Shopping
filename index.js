var express = require('express')
var app = express()
const session = require('express-session');
var bodyParser = require('body-parser')

const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:tailer44@localhost:5432/testdb';

const pool = new Pool({
    connectionString
});

var retails = require('./retail')
var retailFact = retails(pool)
const exphbs = require('express-handlebars');
const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});


app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(express.static('public'))


app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var thePrice = '';
var theUser;
var theColour = '';
var theSize = 0;
var thegender = '';
var theMail;
var theOrder = 0;
var list = [];
var getList;
var lists;
app.get('/', function (req, res) {

    res.render('index')
})


app.post('/logins', async function (req, res) {
    thegender = req.body.genders

    retailFact.addName(thegender)
    retailFact.allData()

    res.redirect('/Male_Section')
})

app.post('/login', async function (req, res) {
    thegender = req.body.genders

    retailFact.addName(thegender)
    retailFact.allData()

    res.redirect('/Female_Section')
})


app.post('/types', function (req, res) {
    thePrice = req.body.price
    
    retailFact.pricesData(thePrice)
    retailFact.allData()
    
    res.redirect('/form')
})

app.post('/types2', function (req, res) {
    thePrice = req.body.price
  
    retailFact.pricesData(thePrice)
    retailFact.allData()

    res.redirect('/form')
})

app.post('/types3', function (req, res) {

    res.redirect('/form')
})

app.post('/done', function (req, res) {

    res.redirect('/')
})

app.post('/form',  function (req, res) {
    theMail = req.body.myMail
    theColour = req.body.colour
    theSize = req.body.size
    theUser = req.body.myUser
    retailFact.myData(theUser, theMail, theColour, theSize)
    retailFact.getOrders()
    retailFact.allData()
    retailFact.finalData();

    res.redirect('/check_Your_Order')
})
app.post('/search',  function (req, res) {
    theOrder = req.body.search
    list =  retailFact.finalData()
     retailFact.checkOrder()

    for (var i = 0; i < list.length; i++) {
        var userz = list[i]
    }


    res.redirect('/check_Your_Order')
})



app.post('/checkout',  function (req, res) {
    res.redirect('/success')
})



app.get('/Female_Section',async function (req, res) {
   
    res.render('shoes2')
})

app.get('/Male_Section',async function (req, res) {
    
    
    res.render('Shoes')
})


app.get('/form', function (req, res) {
   
    
    res.render('form')
})

app.get('/success', async function (req, res) {

    list = await retailFact.finalData()
    

   // list = await retailFact.finalData()
   


    res.render('confirm', { list })
})

app.get('/check_Your_Order',  function (req, res) {
    list = retailFact.finalData()

    for (var i = 0; i < list.length; i++) {
        var user = list[i]

    }
    
    
    res.render('cart', {list

    })
})

var PORT = process.env.PORT || 4000

app.listen(PORT, function () {
    console.log('server', PORT)
})
