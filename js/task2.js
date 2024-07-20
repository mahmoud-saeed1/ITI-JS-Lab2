/*~~~~~$ Selectors $~~~~~*/
const boxes = document.querySelectorAll('.box');

/*~~~~~$ Handlers $~~~~~*/
function handleClick(event) {
    const box = event.target;
    box.removeEventListener('click', handleClick);
    const newBox = box.cloneNode(true);
    newBox.addEventListener('click', handleClick);
    document.querySelector('.container').appendChild(newBox);
}

/*~~~~~$ Utility $~~~~~*/
boxes.forEach(box => box.addEventListener('click', handleClick));
