const electron = require('electron')
const ipc = electron.ipcRenderer

const h3 = document.querySelector('#password')
const newPassBtn = document.querySelector('#genBtn')

let options, length, delimiter, numWords, preNum

newPassBtn.addEventListener('click', function () {
    length = document.querySelector('#length option:checked').value
    delimiter = document.querySelector('#delimiter option:checked').value
    numWords = document.querySelector('#numWords option:checked').value
    preNum = document.querySelector('#check1').checked

    if(length === "Word length") {
        length = "short"
    }
    if(delimiter === "Delimiter") {
        delimiter = "-"
    }
    if(numWords === "Number of words") {
        numWords = 3
    }

    options = new Array(length, delimiter, numWords, preNum)
    ipc.send('click:gen', options)
})

ipc.on('genWord', function (event, arg) {
    h3.innerHTML = arg
})