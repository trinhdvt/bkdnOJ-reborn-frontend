import ScrollToTop from './ScrollToTop';
import {useNavigate, useParams} from 'react-router-dom';

function withNavigation(Component) {
  return props => <Component {...props} navigate={useNavigate()} />;
}

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

export {
    ScrollToTop,
    withNavigation,
    withParams,
}