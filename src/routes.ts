
import Home from './pages/Home';
import InputExample from './examples/InputExample';
import InputExample2 from './examples/InputExample2';

export default [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/example-1',
    name: 'Input Example 1',
    component: InputExample,
  },
  {
    path: '/example-2',
    name: 'Input Example 2',
    component: InputExample2,
  },
];