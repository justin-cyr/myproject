
import { connect } from 'react-redux';

import { loginUser } from '../../actions/session';
import Login from './login';

const mapStateToProps = state => ({
    errors: state.session.errors
});

const mapDispatchToProps = dispatch => ({
    loginUser: formUser => dispatch(loginUser(formUser))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
