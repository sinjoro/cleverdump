cleverdump
==========

Cleverdump for Windows/Linux/Mac.


config.json
-----------
result to path:
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
E.g. `data%year` will save only `data2014` subfolder. 

to path
-------
Complete `to` path will be  
`to+"/cleverdump-"+"name"+"-YYYY-MM-DD HH:mm:ss/"+toSubdirectory`    

For weekly dumps it will be  
`to+"/cleverdump-"+"name"+"-YYYY-w YYYY-MM-DD HH:mm:ss/"+toSubdirectory`  
