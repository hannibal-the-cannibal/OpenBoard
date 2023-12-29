let optioncont= document.querySelector(".options-cont");
let toolscont= document.querySelector(".tools-cont");
let penciltoolcont= document.querySelector(".pencil-tool-cont");
let erasertoolcont= document.querySelector(".eraser-tool-cont");
let pencil= document.querySelector(".pencil");
let eraser= document.querySelector(".eraser");
let sticky = document.querySelector(".stickynotes");
let upload= document.querySelector(".upload");

let pencilflag=false;
let eraserflag= false;


let optionflag=true;
optioncont.addEventListener("click",(e)=>{
    optionflag=!optionflag;
    if(optionflag)
    {
        opentools();
    }
    else
    {
        closetools();
    }
})

function opentools(){
    let iconele= optioncont.children[0];
    iconele.classList.remove("fa-circle-xmark");
    iconele.classList.add("fa-bars");
    toolscont.style.display="flex";
}

function closetools(){
    let iconele= optioncont.children[0];
    iconele.classList.remove("fa-bars");
    iconele.classList.add("fa-circle-xmark");
    toolscont.style.display="none";
    penciltoolcont.style.display="none";
    erasertoolcont.style.display="none";
}

pencil.addEventListener("click",(e)=>{
    pencilflag=!pencilflag;
    if(pencilflag)
    {
        penciltoolcont.style.display="block";
    }
    else
    {
        penciltoolcont.style.display="none";
    }
})

eraser.addEventListener("click",(e)=>{
    eraserflag=!eraserflag;
    if(eraserflag)
    {
        erasertoolcont.style.display="flex";
    }
    else
    {
        erasertoolcont.style.display="none";
    }
})

upload.addEventListener("click",(e)=>{
    //open file explorer
    let input= document.createElement("input");
    input.setAttribute("type", "file");
    input.click();


    input.addEventListener("change",(e)=>{
        let file= input.files[0];
        let url = URL.createObjectURL(file);


        let stickycont= document.createElement("div");
        stickycont.setAttribute("class","sticky-cont");
        stickycont.innerHTML=`
        <div class="header-cont">
                <div class="minimize"></div>
                <div class="remove"></div>
            </div>
            <div class="notes-cont">
                <img src=""${url}/>
            </div>
        `;

        document.body.appendChild(stickycont);

        let minimize=stickycont.querySelector(".minimize");
        let remove=stickycont.querySelector(".remove");
        notesaction(minimize,remove,stickycont);



        stickycont.onmousedown = function(event) {

            draganddrop(stickycont,event);
        };
        
        sticky.ondragstart = function() {
            return false;
        };
    })

    

})

sticky.addEventListener("click",(e)=>{
    let stickycont= document.createElement("div");
    stickycont.setAttribute("class","sticky-cont");
    stickycont.innerHTML=`
    <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="notes-cont">
            <textarea spellcheck="false"></textarea>
        </div>
    `;

    document.body.appendChild(stickycont);

    let minimize=stickycont.querySelector(".minimize");
    let remove=stickycont.querySelector(".remove");
    notesaction(minimize,remove,stickycont);



    stickycont.onmousedown = function(event) {

        draganddrop(stickycont,event);
      };
      
      sticky.ondragstart = function() {
        return false;
      };
})

function draganddrop(element, event)
{
    let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;
      
        element.style.position = 'absolute';
        element.style.zIndex = 1000;
      
        moveAt(event.pageX, event.pageY);
      
        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
         element.style.left = pageX - shiftX + 'px';
         element.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the ball, remove unneeded handlers
        element.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          element.onmouseup = null;
        };
}

function notesaction(minimize,remove,stickycont){
    remove.addEventListener("click",(e)=>{
        stickycont.remove();
    })

    minimize.addEventListener("click",(e)=>{
        let notecont= stickycont.querySelector(".notes-cont");
        let display= getComputedStyle(notecont).getPropertyValue("display");
        if(display==="none")
        {
            notecont.style.display="block";
        }
        else
        {
            notecont.style.display="none";
        }
    })
}