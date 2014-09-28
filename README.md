cleverdump
==========

Cleverdump for Windows/Linux/Mac.

install
-------
```
npm install
grunt
```

**issue with libudev.so at Ubuntu**  
`sed -i 's/\x75\x64\x65\x76\x2E\x73\x6F\x2E\x30/\x75\x64\x65\x76\x2E\x73\x6F\x2E\x31/g' node_modules/nodewebkit/nodewebkit/nw`  

then type `grunt` again. 
To run app after build you can type `npm start`


config.json
-----------
```
{
    "dumps": [
        {
            "name": "express",
            "from": "/media/stanislav/Elements/backup-vera/Triasoft/Express/reg",
            "to": "/share/ndump/daily",
            "toSubdirectory": "Triasoft/Express",
            "onlyCurrent": "%year",
            "frequency": "daily"
        },
        {
            "name": "express",
            "from": "/media/stanislav/Elements/backup-vera/Triasoft/Express/reg",
            "to": "/share/ndump/weekly",
            "toSubdirectory": "Triasoft/Express",
            "frequency": "weekly"
        },
        {
            "name": "express",
            "from": "/media/stanislav/Elements/backup-vera/Triasoft/Express/reg",
            "to": "/share/ndump/yearly",
            "toSubdirectory": "Triasoft/Express",
            "frequency": "yearly"
        }
    ]
}
```

onlyCurrent
----------
When `onlyCurrent` specified only subfolder with current year will be taken.  
E.g. `data%year` will save only `data2014` subfolder during 2014 year and `data2015` during 2015 year. 

to path
-------
Complete `to` path will be  
`to+"/cleverdump-"+"name"+"-YYYY-MM-DD HH:mm:ss/"+toSubdirectory`    

For weekly dumps it will be  
`to+"/cleverdump-"+"name"+"-YYYY-w YYYY-MM-DD HH:mm:ss/"+toSubdirectory`  
