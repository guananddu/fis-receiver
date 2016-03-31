var http = require( 'http' );
var formidable = require( 'formidable' );
var fs = require( 'fs' );
var path = require( 'path' );
var mkdirp = require( 'mkdirp' );

var TMP_DIR=function(){
    var list = ['LOCALAPPDATA', 'APPDATA', 'HOME'];
    var tmp;
    for(var i = 0, len = list.length; i < len; i++){
        if(tmp = process.env[list[i]]){
            break;
        }
    }
    tmp = tmp || __dirname + '/../';
    return path.resolve(tmp,'.fis3-receiver-tmp');
}();
mkdirp(TMP_DIR);

var server = http.createServer( function( req, res ) {

    function error( err ) {
        res.writeHead( 500, {
            'Content-Type': 'text/plain'
        } );
        res.end( err.toString() ); //fail
    }
    function next(from,to){
        fs.rename(from,to,function (err) {
            if(err) return error(err);
            res.writeHead(200, {'content-type': 'text/plain'});
            res.end('0');
        });
    }

    if ( req.url == '/' ) {
        // show a file upload form
        res.writeHead( 200, {
            'content-type': 'text/html'
        } );
        res.end( 'I\'m ready for that, you know.' );
    } else if ( req.url == '/receiver' && req.method.toLowerCase() == 'post' ) {
        var form = new formidable.IncomingForm();
        form.uploadDir=TMP_DIR;
        form.parse( req, function( err, fields, files ) {
            if ( err ) {
                error( err );
            } else {
                var to = fields[ 'to' ];
                fs.exists( to, function( exists ) {
                    if ( exists ) {
                        fs.unlink( to, function( err ) {
                            next( files.file && files.file.path || files[ 'null' ].path, to );
                        } );
                    } else {
                        fs.exists( path.dirname( to ), function( exists ) {
                            if ( exists ) {
                                next( files.file && files.file.path || files[ 'null' ].path, to );
                            } else {
                                mkdirp( path.dirname( to ), 0777, function( err ) {
                                    if ( err ) {
                                        error( err );
                                        return;
                                    }
                                    next( files.file && files.file.path || files[ 'null' ].path, to );
                                } );
                            }
                        } );
                    }
                } );
            }
        } );
    }
} );
module.exports = server;
