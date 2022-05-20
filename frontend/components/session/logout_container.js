
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/session';
import Logout from './logout';

const mapDispatchToProps = dispatch => ({
    logoutUser: () => dispatch(logoutUser())
});

export default connect(null, mapDispatchToProps)(Logout);
