const performance = require('perf_hooks').performance;
const { diff } = require('deep-object-diff');
const createDiffableObject = require('../lib/diff.min').default;

let fullObject = {...require('./mock.json')};

function mutate(obj) {
    obj.basic = 'test';
    obj.structure.composition.again = true; 
    obj.structure.longer.joy.disappear.kept = 'azertyuioop'; 
    obj.structure.longer.joy.disappear.flew = 'azertyuioop'; 
    obj.structure.longer.joy.disappear.shade.substance = 'garage'; 
}

console.log('Classic JS objects mutation + Just-diff');
let start = performance.now();
mutate(fullObject);
const d = diff(require('./mock.json'), fullObject);
let end = performance.now();
console.log(d);
console.log(`Execution time: ${end - start} ms`);


fullObject = require('./mock.json');

console.log('Diffable JS objects');
start = performance.now();
const newObject = createDiffableObject(fullObject);
mutate(newObject);
end = performance.now();
console.log(newObject.getChanges());
console.log(`Execution time: ${end - start} ms`);
