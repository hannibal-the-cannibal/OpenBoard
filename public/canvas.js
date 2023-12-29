let canvas= document.querySelector("canvas");
canvas.width= window.innerWidth;
canvas.height= window.innerHeight;

let pencilcolorcont= document.querySelectorAll(".pencil-color");
let eraserwidthele= document.querySelector(".eraser-width");
let pencilwidthele= document.querySelector(".pencil-width");
let download= document.querySelector(".download");
let undo= document.querySelector(".undo");
let redo= document.querySelector(".redo");



let tool = canvas.getContext("2d");

let undoredoTracker=[];
let track=0; // tells which action needs to be done 


let pencilcolor= "red";
let erasercolor="white";
let pwidth= pencilwidthele.value;
let ewidth= eraserwidthele.value;

tool.strokeStyle=pencilcolor;
tool.lineWidth= pwidth;
let mousedown=false;

pencilcolorcont.forEach((colorele)=>{
    colorele.addEventListener("click",(e)=>{
        let color= colorele.classList[0];
        pencilcolor=color;
        tool.strokeStyle=pencilcolor;
    })
})

pencilwidthele.addEventListener("change",(e)=>{
    pwidth= pencilwidthele.value;
    tool.lineWidth=pwidth;
})

eraserwidthele.addEventListener("change",(e)=>{
    ewidth= eraserwidthele.value;
    tool.linewidth=ewidth;
})

eraser.addEventListener("click",(e)=>{
    if(eraserflag)
    {
        tool.strokeStyle=erasercolor;
        tool.lineWidth= ewidth;
    }
    else
    {
        tool.strokeStyle=pencilcolor;
        tool.lineWidth= pwidth;
    }
})





// tool.beginPath(); // new graphic start
// tool.moveTo(10,10); // start point of line 
// tool.lineTo(100,80); // end point
// tool.stroke(); // Stroke the path to actually draw it

// tool.lineTo(554,39); // begin to if not given , new path continue from old path only 
// tool.stroke();


// mouse down -> start new path // move moust-> path generate
canvas.addEventListener("mousedown",(e)=>{
    mousedown=true;
    // tool.beginPath();
    // tool.moveTo(e.clientX,e.clientY);

    let data={
        x:e.clientX,
        y:e.clientY
    }
    socket.emit("beginPath",data);

})

canvas.addEventListener("mousemove", (e)=>{
    if(mousedown)
    {
        // tool.lineTo(e.clientX,e.clientY);
        // tool.stroke();

        let data={
            x:e.clientX,
            y:e.clientY
        }
        socket.emit("lineTo",data);

    }
})

canvas.addEventListener("mouseup",(e)=>{
    mousedown=false;
    let url = canvas.toDataURL();
    undoredoTracker.push(url);
    track=undoredoTracker.length-1;
    socket.emit('endPath', {url: url, track: track});

})

download.addEventListener("click",(e)=>{
    let url= canvas.toDataURL();

    let a =document.createElement("a");
    a.href=url;
    a.download= "board.jpg";
    a.click();
})

undo.addEventListener("click",(e)=>{
    if(track>0)
    {
        track--;
    }
    let trackobj={
        trackvalue:track,
        undoredotrackvalue: undoredoTracker
    }
    // undoredoCanvas(trackobj);

    socket.emit("undo", trackobj);
})

redo.addEventListener("click",(e)=>{
    if(track<undoredoTracker.length-1)
    {
        track++;
    }

    let trackobj={
        trackvalue:track,
        undoredotrackvalue: undoredoTracker
    }
    // undoredoCanvas(trackobj);

    socket.emit("redo", trackobj);
})

function undoredoCanvas(trackobj){
    track= trackobj.trackvalue;
    undoredoTracker= trackobj.undoredotrackvalue;

    let url= undoredoTracker[track];
    let img= new Image();
    img.src=url;
    img.onload=(e)=>{
        tool.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing the image
        tool.drawImage(img,0,0,canvas.width,canvas.height);
        let updatedUrl = canvas.toDataURL();
        socket.emit('updateCanvas', {url: updatedUrl, track: track});
    }
}

socket.on("beginPath",(data)=>{
    //data received from server 
    tool.beginPath();
    tool.moveTo(data.x, data.y);
})

socket.on("lineTo", (data)=>{
    //data received from server
    tool.lineTo(data.x,data.y);
    tool.stroke();
})

socket.on("endPath",(data)=>{
    //data received from server 
    let img= new Image();
    img.src=data.url;
    img.onload=(e)=>{
        tool.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing the image
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
})

socket.on("undo", (trackobj) => {
    undoredoCanvas(trackobj);
})

socket.on("redo", (trackobj) => {
    undoredoCanvas(trackobj);
})

socket.on('updateCanvas', (data) => {
    let img= new Image();
    img.src=data.url;
    img.onload=(e)=>{
        tool.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing the image
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
});

