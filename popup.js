let task=[];

const startTimerBtn=document.getElementById("start-timer-btn")
const addTaskBtn=document.getElementById("add-task-btn")

startTimerBtn.addEventListener("click",()=>{
    chrome.storage.local.get(["isRunning"],(res)=>{
        chrome.storage.local.set({
            isRunning:!res.isRunning,
        },()=>{
            startTimerBtn.textContent=!res.isRunning?"Pause Timer":"Start Timer"
        })
    })
})

function updateTime(){
    chrome.storage.local.get(["timer","timeOption","isRunning"],(res)=>{

        const time=document.getElementById("time")
        const minutes = `${res.timeOption-Math.ceil(res.timer/60)}`.padStart(2,'0')
        let second="00"
        if(res.timer%60!=0)
        {
            second = `${60-res.timer%60}`.padStart(2,'0')
        }
        time.textContent=`${minutes}:${second}`
        startTimerBtn.textContent=res.isRunning?"Pause Timer":"Start Timer"
    })
}

updateTime();
setInterval(updateTime,1000)

const resetTimerBtn=document.getElementById("reset-timer-btn")
resetTimerBtn.addEventListener("click",()=>{
    chrome.storage.local.set({
        timer:0,
        isRunning:false,
    },()=>{
        startTimerBtn.textContent="Start Timer";
    })
})

addTaskBtn.addEventListener("click",()=>addTask())

chrome.storage.sync.get(["task"],(res)=>{
    task=res.task?res.task:[]
    renderTasks()
})

function saveTasks(){
    chrome.storage.sync.set({
        task,
    })
}

function renderTask(taskNum){
    const taskRow=document.createElement("div")

    const text = document.createElement("input")
    text.type="text"
    text.placeholder = "Enter a task....."
    text.value=task[taskNum];
    text.className = "task-input"
    text.addEventListener("change",()=>{
        task[taskNum]=text.value
        saveTasks()
    })

    const deleteBtn=document.createElement("input")
    deleteBtn.type="button"
    deleteBtn.value="x"
    deleteBtn.className="task-delete"
    deleteBtn.addEventListener("click",()=>{
        deleteTask(taskNum)
    })

    taskRow.appendChild(text)
    taskRow.appendChild(deleteBtn)

    const taskContainer=document.getElementById("task-container")
    taskContainer.appendChild(taskRow)
}

function addTask(){
    const taskNum=task.length;
    task.push("")
    renderTask(taskNum)
    saveTasks()
}

function deleteTask(taskNum){
    task.splice(taskNum,1)
    renderTasks();
    saveTasks()
}

function renderTasks(){
    const taskContainer=document.getElementById("task-container")
    taskContainer.textContent=""
    task.forEach((taskText,taskNum)=> {
        renderTask(taskNum)
    });
}