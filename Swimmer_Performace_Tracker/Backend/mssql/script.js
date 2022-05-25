//S3G8_Project
var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors());
var sql = require('mssql');
var DB = DB || {};
const { load } = require("mime");
DB.SQLConnect =  class{
    constructor(){
//S3G8_Project
//testDatabase113
        this.config = {
            server: 'titan.csse.rose-hulman.edu',
            database: 'S3G8_Project',
            user: '<your user>',
            password: '<password>',
            options: {
                trustedConnection: true,
                encrypt: true,
                enableArithAbort: true,
                trustServerCertificate: true,
            
              },
        };

        this.dbCon = new sql.ConnectionPool(this.config);
    }

    getAllRace(ID){
        return new Promise((resolve, reject) => {

            this.dbCon.connect().then(() => {
               
                const ps = new sql.PreparedStatement(this.dbCon);
                ps.input('param', sql.Int);
                ps.prepare("SELECT * from [dbo].[Race] WHERE SwimmerID = @param Order by MeetDate asc").then(() => {
                        ps.execute({ param: ID}).then((result) => {
                            ps.unprepare().then().catch((err) => {
                                console.log(err)
                            })
                            if (result.returnValue > 0) {
                                reject("Retrieve failed");
                            }

                            
                            const recordSet = result.recordsets;

                            // console.log(successObject);
                            this.dbCon.close();
                            resolve(recordSet);
                        }).catch((err) => {
                            console.log(err);
                            this.dbCon.close();
                            reject(err);
                        });
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    })

            }).catch((err) => {
                //9.
                reject(err);
            });

        })
    }


    getComparisonData(ID, racename, profID){
        return new Promise((resolve, reject) => {

            this.dbCon.connect().then(() => {
               
                const ps = new sql.PreparedStatement(this.dbCon);
                ps.input('param', sql.Int)
                ps.input('param2', sql.VarChar(30))
                ps.input('param3',sql.Int)
                ps.prepare("Select * from Race where SwimmerID = @param and RaceName = @param2 UNION Select * from Race where SwimmerID = @param3 and RaceName = @param2 Order by RaceTime Asc").then(() => {
                        ps.execute({ param: ID, param2:racename, param3:profID}).then((result) => {
                            ps.unprepare().then().catch((err) => {
                                console.log(err)
                            })
                            if (result.returnValue > 0) {
                                reject("Retrieve failed");
                            }

                            
                            const recordSet = result.recordsets;

                            // console.log(successObject);
                            this.dbCon.close();
                            resolve(recordSet);
                        }).catch((err) => {
                            console.log(err);
                            this.dbCon.close();
                            reject(err);
                        });
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    })

            }).catch((err) => {
                //9.
                reject(err);
            });

        })
    }


    getQualifyingTime(racename){
        return new Promise((resolve, reject) => {

            this.dbCon.connect().then(() => {
               
                const ps = new sql.PreparedStatement(this.dbCon);
                ps.input('param', sql.VarChar(20))
                //ps.input('param2', sql.VarChar(30))
                ps.prepare("Select * from QualifyingTime where RaceName = @param").then(() => {
                        ps.execute({ param: racename}).then((result) => {
                            ps.unprepare().then().catch((err) => {
                                console.log(err)
                            })
                            if (result.returnValue > 0) {
                                reject("Retrieve failed");
                            }

                            
                            const recordSet = result.recordsets;

                            // console.log(successObject);
                            this.dbCon.close();
                            resolve(recordSet);
                        }).catch((err) => {
                            console.log(err);
                            this.dbCon.close();
                            reject(err);
                        });
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    })

            }).catch((err) => {
                //9.
                reject(err);
            });

        })
    }



    getRaceWithinWeek(ID,racename){
        return new Promise((resolve, reject) => {

            this.dbCon.connect().then(() => {
               
                const ps = new sql.PreparedStatement(this.dbCon);
                ps.input('param', sql.Int)
                ps.input('param2', sql.VarChar(30))
                ps.prepare("SELECT * FROM dbo.getRaceByPersonAndName(@param,@param2) order by MeetDate").then(() => {
                        ps.execute({ param: ID, param2:racename}).then((result) => {
                            ps.unprepare().then().catch((err) => {
                                console.log(err)
                            })
                            if (result.returnValue > 0) {
                                reject("Retrieve failed");
                            }

                            
                            const recordSet = result.recordsets;

                            // console.log(successObject);
                            this.dbCon.close();
                            resolve(recordSet);
                        }).catch((err) => {
                            console.log(err);
                            this.dbCon.close();
                            reject(err);
                        });
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    })

            }).catch((err) => {
                //9.
                reject(err);
            });

        })
    
    }


    //to:do

    getAllMeetName(){

    }
    
    getRaceNameByMeet(meetname){

    }

    getSwimmer(ID){
        return new Promise((resolve, reject) => {

            this.dbCon.connect().then(() => {
               
                const ps = new sql.PreparedStatement(this.dbCon);
                ps.input('param', sql.Int)
                ps.prepare("SELECT * from [dbo].[Person] as p join [dbo].[Swimmer] as s ON p.ID = s.ID WHERE s.ID = @param").then(() => {
                        ps.execute({ param: ID }).then((result) => {
                            ps.unprepare().then().catch((err) => {
                                console.log(err)
                            })
                            if (result.returnValue > 0) {
                                reject("Retrieve failed");
                            }

                            if (!result.recordset && !result.recordset[0]) {
                                reject("Retrieve failed");
                            }
                            const recordSet = result.recordset[0];

                            // console.log(successObject);
                            this.dbCon.close();
                            resolve(recordSet);
                        }).catch((err) => {
                            console.log(err);
                            this.dbCon.close();
                            reject(err);
                        });
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    })

            }).catch((err) => {
                //9.
                reject(err);
            });

        })
    }
    register(firstname, lastname, middleName, birth, gender, username,height, weight, salt, hash){
       
        return new Promise((resolve, reject) => {
            this.dbCon.connect().then(() => {
                
                    const ps = new sql.PreparedStatement(this.dbCon)
                    ps.input('firstNameParam', sql.VarChar(20))
                    ps.input('lastNameParam', sql.VarChar(30))
                    ps.input('middleNameParam', sql.VarChar(20))
                    ps.input('dobParam', sql.Date)
                    ps.input('userNameParam', sql.VarChar(30))
                    ps.input('passwordHashParam', sql.VarChar(20))
                    ps.input('passwordSaltParam', sql.VarChar(20))
                    ps.input('genderParam', sql.VarChar(1))
                    ps.input('heightParam', sql.VarChar(10))
                    ps.input('weightParam', sql.VarChar(10))
                    ps.prepare('Declare @ID int; Exec dbo.[registerUser] @firstName=@firstNameParam, @lastName=@lastNameParam, @middleName=@middleNameParam, @dob=@dobParam, @userName=@userNameParam, @passwordHash=@passwordHashParam, @passwordSalt=@passwordSaltParam, @gender=@genderParam, @height = @heightParam, @weight = @heightParam, @id=@ID output')
                        .then(() => {
                            ps.execute({ firstNameParam: firstname, lastNameParam: lastname, middleNameParam: middleName, dobParam: birth, genderParam: gender, userNameParam: username,
                                 passwordHashParam: hash, passwordSaltParam: salt, weightParam: weight, heightParam: height}).then((result) => {
                                ps.unprepare().then(()=>{
                                    this.dbCon.close().then(()=>{
                                        resolve(result);
                                    })
                                }).catch((err) => {
                                    console.log(err);
                                    reject("register failed");
                                })
                                
                                if (result.returnValue > 0) {
                                    reject("Register failed");
                                }
                                // this.dbCon.close();
                                resolve();
                            }).catch((err) => {
                                console.log(err);
                                this.dbCon.close();
                                reject(err);
                            });
                        }).catch((err) => {
                            this.dbCon.close();
                            console.log(err)
                            reject(err);
                        })


            }).catch((err) => {
                //9.

                console.log(err);
            });
        })


    }

    login(username){
        return new Promise((resolve, reject) => {

            this.dbCon.connect().then(() => {
                const ps = new sql.PreparedStatement(this.dbCon);
                ps.input('param', sql.VarChar(20))
                ps.prepare('Select personID, passwordHash, passwordSalt from [login] where username = @param').then(() => {
                    ps.execute({ param: username }).then((result) => {
                        ps.unprepare().then().catch((err) => {
                            console.log(err)
                        })
                        if (result.returnValue > 0) {
                            reject("Login failed");
                        }

                        if (!result.recordset && !result.recordset[0]) {
                            reject("Login failed");
                        }
                        const recordSet = result.recordset[0];
                        const successObject = {
                            ID: recordSet.personID,
                            passwordSalt: recordSet.passwordSalt,
                            passwordHash: recordSet.passwordHash
                        }
                        // console.log(successObject);
                        this.dbCon.close();
                        resolve(successObject);
                    }).catch((err) => {
                        console.log(err);
                        this.dbCon.close();
                        reject(err);
                    });
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                })

            })

        })
    }

    addRace(raceName, racetime, meetname, meetdate, personID, age){
        return new Promise((resolve, reject) => {
            this.dbCon.connect().then(() => {
                    const ps = new sql.PreparedStatement(this.dbCon)
                    ps.input('raceNameParam', sql.VarChar(30))
                    ps.input('racetimeParam', sql.VarChar(20))
                    ps.input('meetnameParam', sql.VarChar(20))
                    ps.input('meetDateParam', sql.Date)
                    ps.input('personIDparam', sql.Int)
                    ps.input('ageParam', sql.Int)
                    console.log(racetime);
                    ps.prepare('Exec dbo.[addRace] @raceName=@raceNameParam, @racetime=@racetimeParam, @meetname=@meetnameParam, @meetdate=@meetDateParam, @personID=@personIDparam, @age = @ageParam')
                        .then(() => {
                            ps.execute({raceNameParam: raceName, racetimeParam: racetime, meetnameParam: meetname, meetDateParam: meetdate, personIDparam: personID, ageParam: age}).then((result) => {
                                ps.unprepare().then(()=>{
                                    this.dbCon.close().then(()=>{
                                        resolve(result);
                                    })
                                }).catch((err) => {
                                    console.log(err);
                                    reject("add race failed");
                                })
                                
                                if (result.returnValue > 0) {
                                    reject("add race failed");
                                }
                                // this.dbCon.close();
                                resolve();
                            }).catch((err) => {
                                console.log(err);
                                this.dbCon.close();
                                reject(err);
                            });
                        }).catch((err) => {
                            this.dbCon.close();
                            console.log(err)
                            reject(err);
                        })


            }).catch((err) => {
                //9.

                console.log(err);
            });
        })
    }


    getProfSwimmer(ID, age, racename){
        return new Promise((resolve, reject) => {

            this.dbCon.connect().then(() => {
               
                const ps = new sql.PreparedStatement(this.dbCon);
                ps.input('param', sql.Int)
                ps.input('param2', sql.Int)
                ps.input('param3', sql.VarChar(30))
                ps.prepare("SELECT * from [dbo].[Race] WHERE SwimmerID = @param and RaceName = @param3 AND (age = @param2 or age = @param2 + 1 or age = @param - 1 or age = @param - 2 or age = @param + 2) Order by RaceTime asc").then(() => {
                        ps.execute({ param: ID, param2:age, param3:racename}).then((result) => {
                            ps.unprepare().then().catch((err) => {
                                console.log(err)
                            })
                            if (result.returnValue > 0) {
                                reject("Retrieve failed");
                            }

                            
                            const recordSet = result.recordsets;

                            // console.log(successObject);
                            this.dbCon.close();
                            resolve(recordSet);
                        }).catch((err) => {
                            console.log(err);
                            this.dbCon.close();
                            reject(err);
                        });
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    })

            }).catch((err) => {
                //9.
                reject(err);
            });

        })
    }
       


}
DB.SQLConnect = new DB.SQLConnect();

const logger = require("morgan");
app.use(logger('dev'));//helpful information when requests come in.
var bodyParser = require("body-parser");
app.use('/api/', bodyParser.urlencoded({ extended: true }));
app.use('/api/', bodyParser.json());


app.get("/api/swimmer/id/:id",(req, res)=>{
    let id = req.params.id
    //TO DO
    DB.SQLConnect.getSwimmer(id).then((result) => {
        let data = {"result":result};
        res.json(data);
    })
})

app.get("/api/race/:id",(req,res)=>{
    let id = req.params.id;

    DB.SQLConnect.getAllRace(id).then((result) => {
        let data = {"result":result};
        res.json(data);
    })
})


app.get("/api/qt/:Racename/",(req,res)=>{
    let racename = req.params.Racename;
  

    DB.SQLConnect.getQualifyingTime(racename).then((result) => {
        let data = {"result":result};
        res.json(data);
    })
})


app.get("/api/raceWithinWeek/:id/:racename",(req,res) => {
    let id = req.params.id;
    let racename = req.params.racename;
   
    console.log(id);
    DB.SQLConnect.getRaceWithinWeek(id, racename).then((result) => {
        let data = {"result":result};
        res.json(data);
    })
})

app.get("/api/comparisonData/:id/:racename/:profid",(req,res) => {
    let id = req.params.id;
    let racename = req.params.racename;
    let profid = req.params.profid;
    
    DB.SQLConnect.getComparisonData(id, racename, profid).then((result) => {
        let data = {"result":result};
        res.json(data);
    })
})

app.get("/api/profSwimmer/:id/:age/:racename",(req,res) => {
    let id = req.params.id;
    let age = req.params.age;
    let racename = req.params.racename;
    console.log(age);
    console.log(id);
    DB.SQLConnect.getProfSwimmer(id, age, racename).then((result) => {
        let data = {"result":result};
        res.json(data);
    })
})

app.get('/', function(req, res){
    res.send("");
    res.end();
});




app.post("/api/register", (req, res)=>{
    console.log(req.body);
    let fname = req.body.fname
    let lname = req.body.lname
    let mname = req.body.mname
    let password = req.body.password
    let dob = req.body.dob
    let gender = req.body.gender
    let username = req.body.username

    let weight = req.body.weight;
    let height = req.body.height;
   
    let salt = getNewSalt();
    let hash = hashPassword(password, salt);
    DB.SQLConnect.register(fname, lname, mname,dob,gender,username,height, weight, salt, hash).then(result => {
        console.log("successfully registered.");
        let data = { "username": username };
        res.status(201);
        res.json(data);
    }).catch((error) => {
        console.log(error);
        
    });
})


app.post("/api/addRace", (req, res) => {
    
    let personID = req.body.personID
    let raceName = req.body.raceName
    let age = req.body.age
    console.log(age)
    let racetime = req.body.racetime
    let meetname = req.body.meetname
    let meetdate = req.body.meetdate
    DB.SQLConnect.addRace(raceName, racetime, meetname, meetdate, personID, age).then(result => {
        console.log("added race");
        console.log(meetdate);
        res.status(201);
        let data = {};
        res.status(201);
        res.json(data);
    }).catch((error) => {
        console.log(error);
        
    });
})




app.post("/api/login",(req, res)=>{
    console.log(req.body);
    let username = req.body.user;
    let password = req.body.password;
    DB.SQLConnect.login(username, password).then(result => {
        let id = result.ID
        let salt = result.passwordSalt;
        let hash = result.passwordHash;
       console.log(id);
        if(checkPassword(password, salt, hash)){
            let data = {
                "ID":id,
                "success": true
            }
            res.status(201);
            res.json(data);
        }else{
            let data = {
                "username":username,
                "success":false
            }
            res.status(404);
            res.json(data);
        }
    }).catch((err) => {
        console.log(err);
        res.json(err);
    })

})


//*************************************************************************//
// Password Hashing
//*************************************************************************//
var pbkdf2 = require('pbkdf2')
var crypto = require("crypto");
const { waitForDebugger } = require("inspector");
const { resolve } = require("path");



function getNewSalt() {
    let length = 16;
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') 
        .slice(0, length); 
}


function hashPassword(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password.toString());
    var value = hash.digest('hex').toString();
    return value.substring(0, 16); 
}

function checkPassword(password, salt, hash) {
    return hash == hashPassword(password, salt);
}


app.listen(3000, () => console.log('Application is running'));

