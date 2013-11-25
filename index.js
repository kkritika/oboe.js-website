
var express = require('express'),
    app = express(),
    consolidate = require('consolidate'),
    readContent = require('./read-content.js'),

    UNMINIFIED_SCRIPTS = [
        "//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"
    ,   "/js/jquery.sticky.js"
    ,   "/js/app.js"
    ],

    UNMINIFIED_STYLESHEETS = [
        "oboe.css"
    ,   "content.css"
    ];    

app.engine('handlebars', consolidate.handlebars);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

function respondWithMarkdown(res, markdownFilename, opts){
    
    opts = opts || {};
    opts.scripts     = UNMINIFIED_SCRIPTS;
    opts.stylesheets = UNMINIFIED_STYLESHEETS;
    
    readContent(markdownFilename, function( outline ){
    
        opts.content = outline.content;
        opts.heading = outline.heading;
        opts.sections = outline.sections;
        res.status(outline.status);
        res.render('page', opts);
    });
}

app
   .get('/demo', function(req, res){

        res.render('demo', function(err, demoContentHtml) {
            res.render('page', {
                scripts:     UNMINIFIED_SCRIPTS
                                .concat('/js/demo/model.js'),
                stylesheets: UNMINIFIED_STYLESHEETS
                                .concat('demo.css'),                
                content: demoContentHtml
            });
        });
   })    
   .get('/', function(req, res){
        respondWithMarkdown(res, 'index', {
            home:'true'
        });
   })
   .get('/:page', function(req, res){
       respondWithMarkdown(res, req.params.page);
   })
    
/*  .get('/articles/:article', function(req, res){
        respondWithMarkdown(res, 'articles/' + req.params.article);
    })*/   
   .use(express.static('statics'))
   .use(express.static('components/oboe/dist'))
   .use(express.static('components/jquery'))
   .use(express.static('components/d3'))
   .listen(8888);