module.exports= function (io) {

    var userAmount=0,
        userData={};

    io.sockets.on("connection",function(socket){
        userData[socket.id]=null;
        io.emit("userAmount", ++userAmount);

        socket.on("mouse_activity",function(data){
            userData[socket.id]=data;
            io.emit("userPositions",userData);
        });
        socket.on('disconnect', function () {
            delete userData[socket.id];
            io.emit("userAmount", --userAmount);
        });
    });
};
