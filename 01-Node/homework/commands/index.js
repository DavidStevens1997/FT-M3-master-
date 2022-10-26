let fs = require('fs');

module.exports = {
    echo: function(args, print){
        print(args.join(" "));
    },
    date: function(args, print){
        print(Date());
    },
    ls: function(args, print){
        fs.readdir('.', function(err, files){
            //console.log(files)
            if(err) throw err;
            print(files.join('\n')); 
        })
    },
    pwd: function(args, print){ //imprimir directorio sobre el cual estoy trabajando 
        print(process.cwd());
    }
}