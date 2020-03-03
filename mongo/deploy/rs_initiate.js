print("********************************************************************");
print("*****************       Creating replica set      ******************");
print("********************************************************************");

var rs_cluster = {
    _id: "rs_name",
    members: [
        {_id: 0, host: 'mongo1:27010'},
        {_id: 1, host: 'mongo2:27011'},
        {_id: 2, host: 'mongo3:27012'}
    ]
};

var sleep = function (milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
};

var replStatus = rs.status();

if(replStatus && replStatus.ok === 1){
    print(" ### Replication OK");
    printjson(replStatus);
} else {
    print(" ### Starting replication...");
    printjson(rs.initiate(rs_cluster));
    sleep(5000);
    print(" ");
    print(" ### Replica Set status");
    printjson(rs.status());
}

print("********************************************************************");
print("*****************       Replica Set Created      *******************");
print("********************************************************************");
