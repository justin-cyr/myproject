
import { connect } from 'react-redux';

import LoggedInNavBar from './logged_in_nav_bar';

const mapStateToProps = state => ({
    user: state.session.currentUser
});

export default connect(mapStateToProps)(LoggedInNavBar);