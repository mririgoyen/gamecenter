import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';

import 'typeface-alata';

import './style/defaults.scss';
import App from '~/components/App/App';

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('root')
);
