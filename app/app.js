/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>


//  MÓDULOS NECESARIOS
// --------------------
var express = require('express');
var path = require('path');
var app = express();
var conf = require('./config').config();

var sendgrid  = require('sendgrid')(conf.email.key);

var hogan = require('hogan.js');
var fs = require('fs');



//  SETTINGS
// ----------
// hogan js templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// obtener la plantilla de email
var template = fs.readFileSync('./app/views/email.hjs','utf-8');

// compilar la plantilla email
var compiledTemplate = hogan.compile(template);



//  RUTAS
// -------
// Home
app.get("/", function(req, res) {
  
  var strHello = "<h1>Bienvenido al ejemplo</h1>";
  strHello += "<p><a href='/preview'>Preview email</a>.</p>";
  strHello += "<p><a href='/send'>Send email</a>.</p>";
  
	res.send(strHello);
});
  
// Enviar email
app.get('/send', function(req, res) {
  
  var opcionesMail = {
    to:       'info@koldohernandez.com',
    from:     conf.email.from,
    subject:  'Hola!',
    html:     compiledTemplate.render({firsName: 'Koldo'})
  };
  
  sendgrid.send(opcionesMail, function(err, json) {
    
    var strRdo = "";
    if (err) {
       
      strRdo = "<p>Se ha producido un error:</p>";
      strRdo += "<p>" + err + "</p>";

    } else  {
      
      strRdo = "<p>Email enviado correctamente.</p>";
    
    }
    
    strRdo += "<p><a href='/'>Volver</a></p>";
    
    res.send(strRdo);
  });
  
});


// Preview
app.get('/preview', function(req, res) {
  res.render('email', {firsName: 'Koldo'});
});



//  ARRANCAR EL SERVER
// --------------------
// Escuchar en el puerto configurado
app.listen(conf.port);

// Log para saber cuando se arranca el servidor
console.log('App escuchando en el puerto: ' + conf.port);
