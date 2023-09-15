# Experimental
# Diffable object

Small library that is tracking the changes done to an object and all his children (can be objects or arrays).

### Importing library

```javascript
import createDiffableObject from 'diffable-object'
```

## Usage

```typescript
import createDiffableObject from 'diffable-object'

const source = {
    foo: {
        bar: {
            key: 'value',
            key2: 'value2'
        }
    },
    other: {
        key1: 'value'
    }
};
const obj = createDiffableObject(source);

obj.foo.bar.key = 'change';

console.log(obj.getChanges());
```

Print:
```js
 {
    foo: {
        bar: {
            key: 'change'
        }
    }
}
```
