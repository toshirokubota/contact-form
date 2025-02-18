
const form = document.getElementById('form');
const modal = document.querySelector('.modal');
const input_names = ['first-name', 'last-name', 'email', 'query-type', 'message', 'consent'];

//associate each input name to its container for error handling
const containers = new Map();
for(let name of input_names) {
    let query = 'input[name='+name+'], textarea[name='+name+']';
    let elm = document.querySelector(query);
    while(elm) {
        if(elm.classList.contains('input-group')) {
            containers.set(name, elm);
            break;
        }
        elm = elm.parentNode;
    }
    if(!elm) {
        console.log('failed to find a container for ', name);
    }
}
//console.log(containers);

//error checkers
const notEmpty = (value) => {
    return value && value.trim().length > 0;
}
const isEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
}

//associate each input name with error handlers
const validator = {
    'first-name': [notEmpty],
    'last-name' : [notEmpty],
    'email' : [notEmpty, isEmail],
    'message': [notEmpty],
    'query-type': [notEmpty],
    'consent': [notEmpty]
};

//associate each error handler with an error text class
const errorIndicators = new Map();
errorIndicators[notEmpty] = '.error-empty';
errorIndicators[isEmail] = '.error-format';

let invalid_elms = []; //for quick clearance of error indicators
function handleSubmit(e) {
    //clear errors first
    for(let elm of invalid_elms) {
        elm.classList.remove('invalid');
    }
    invalid_elms = []; //clear the array

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log(data);

    for(let name of input_names) {
        // console.log(name);
        for(let handler of validator[name]) {
            // console.log(handler);
            if(!data[name] || !handler(data[name])) {
                let container = containers.get(name);
                if(!container) {
                    console.log('no container found for ', name);
                    continue;
                }
                for(let elm of container.querySelectorAll(errorIndicators[handler])) {
                    elm.classList.add('invalid');
                    invalid_elms.push(elm);
                }
                container.classList.add('invalid');
                invalid_elms.push(container);
                break; //one error indicator at a time
            }
        }
    };
    //console.log('invalids', invalid_elms);
    e.preventDefault(); // prevent the default behaviour
    if(invalid_elms.length === 0) {
        form.reset();
        modal.classList.toggle('valid'); //show the confirmation modal
    }
}
form.addEventListener('submit', handleSubmit);

//modal is closed by clicking it
console.log('modal', modal);
modal.addEventListener('click', ()=>{
    modal.classList.toggle('valid');
});
document.addEventListener('keydown', ()=>{
    if(modal.classList.contains('valid')) {
        modal.classList.toggle('valid');
    }
});

//focus of radio inputs
document.querySelectorAll("input[name='query-type']").forEach(input => {
    input.addEventListener('focus', function() {
        this.parentNode.style.backgroundColor = 'hsl(148, 38%, 91%)'; // Change background color on focus
    });

    input.addEventListener('blur', function() {
        this.parentNode.style.backgroundColor = ''; // Reset background color on blur
    });
});


