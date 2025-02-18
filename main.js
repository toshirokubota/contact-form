
const form = document.getElementById('form');
const modal = document.querySelector('.modal');
// const fname = document.getElementById('first-name');
// const lname = document.getElementById('last-name');
// const email = document.getElementById('email');
// const message = document.getElementById('message');
// const qtype1 = document.getElementById('query-type1');
// const qtype2 = document.getElementById('query-type2');
// const consent = document.getElementById('consent');
// const inputs = [fname, lname, email, message, qtype1, consent];
const input_names = ['first-name', 'last-name', 'email', 'query-type', 'message', 'consent'];

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
console.log(containers);

const notEmpty = (value) => {
    return value && value.trim().length > 0;
}
const isEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
}
const validator = {
    'first-name': [notEmpty],
    'last-name' : [notEmpty],
    'email' : [notEmpty, isEmail],
    'message': [notEmpty],
    'query-type': [notEmpty],
    'consent': [notEmpty]
};
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
    console.log('invalids', invalid_elms);
    e.preventDefault(); // prevent the default behaviour
    if(invalid_elms.length === 0) {
        form.reset();
        modal.classList.toggle('valid');
    }
}
form.addEventListener('submit', handleSubmit);

//modal is closed by clicking it
console.log('modal', modal);
modal.addEventListener('click', ()=>{
    modal.classList.toggle('valid');
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


