var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    db: null,
    counter: 0,

    SQLiteTest: function () {
        console.log('*** SQLite Test Starting')
        var db = window.sqlitePlugin.openDatabase({name: "my.db"});
        console.log('SQLite DB: ' + db);
        this.initDB();
    },

    WebSQLTest: function () {
        console.log('*** WebSQL Test Starting')
        db = openDatabase('mydb', '1.0', 'my.db', 1 * 1024 * 1024);
        console.log('WebSQL DB: ' + db);
        this.initDB();
    },

    initDB: function () {
        var query = "CREATE TABLE IF NOT EXISTS test (id integer primary key, foo text, bar text)";
        var that = this;
        console.log('initDB execute');
        this.execute(query, []).then(function (result) {
            console.log('Create table result: ' + JSON.stringify(result));
            that.loopTest();
        }, function (reason) {
            console.log('Create table reason: ' + JSON.stringify(reason));
        }).catch(function (err) {
            console.log('Create table err: ' + JSON.stringify(err));
        })
    },

    loopTest: function (count) {
        var query = "INSERT INTO test (foo, bar) VALUES (?,?)";
        console.log('loop test');
        for (var i = 0; i < 2000; i++) {
            this.execute(query, ['foo', 'bar']).then(function (result) {
                console.log("INSERT ID -> " + result.insertId);
            }, function (reason) {
                console.log('Create table reason: ' + JSON.stringify(reason));
            }).catch(function (err) {
                console.log('Create table err: ' + JSON.stringify(err));
            })
        }
    },

    execute: function (query, bindings) {
        var deferred = $q.defer();
        console.log('create transaction');
        db.transaction(function (tx) {
            bindings = typeof bindings !== 'undefined' ? bindings : [];
            console.log('executeSql');
            tx.executeSql(query, bindings, function (tx, result) {
                    deferred.resolve(result);
                },
                function (tx, error) {
                    console.log("SQL Execute/Transaction Error: " + error.message + ". CODE: " + error.code);
                    deferred.reject(error);
                });
        });
        return deferred.promise;
    }
};

app.initialize();
$q = Q;



