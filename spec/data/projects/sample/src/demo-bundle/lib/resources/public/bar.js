import foo from './foo';
import './css/two.css';

export default function bar() {
    console.log('this loaded correctly');
    foo();
}
