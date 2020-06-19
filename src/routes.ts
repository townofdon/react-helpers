
import HomePage from './pages/HomePage';
import InputExamplePage from './pages/InputExamplePage';
import InputExample2Page from './pages/InputExample2Page';
import InputMaskPage from './pages/InputMaskPage';

export default [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/input-example-1',
    name: 'Input Example 1',
    component: InputExamplePage,
  },
  {
    path: '/input-example-2',
    name: 'Input Example 2',
    component: InputExample2Page,
  },
  {
    path: '/input-mask',
    name: 'Input Mask',
    component: InputMaskPage,
  },
];