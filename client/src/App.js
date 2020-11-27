import React from 'react';
import './App.css';
import Header from './components/Header';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from './components/LoginForm';
import LecturePage from './components/LecturePage';
import API from './api';
import { Redirect, Route} from 'react-router-dom';
import { Switch } from 'react-router';
import { AuthContext } from './auth/AuthContext';
import { withRouter } from 'react-router-dom';
import CalendarPage from './components/CalendarPage';


class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = { lecture: { title: "" }, filter: 'all', };
  }

  componentDidMount() {
    API.isAuthenticated()
    .then((user) => {
        this.setState({ authUser: user });
      })
    .catch((err) => {
      this.setState({ authErr: err.errorObj });
      this.props.history.push("/login");
    });
  }

  handleErrors(err) {
    if (err) {
      if (err.status && err.status === 401) {
        this.setState({ authErr: err.errorObj, authUser: null });
        this.props.history.push("/login");
      }

      /*if (err.status && err.status === 404) {
        this.setState({ apiError: 404 })
        this.props.history.push("/");
      }*/
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.    
    this.handleErrors(error);
  }

  // Add a logout method
  logout = () => {
    API.userLogout().then(() => {
      this.setState({ authUser: null, authErr: null });
      this.props.history.push("/");
    });
  }

  // Add a login method
  login = (username, password) => {
    API.userLogin(username, password)
      .then((user) => {
        this.setState({ authUser: user, authErr: null });
        this.props.history.push("/calendar");
      }).catch(
        (errorObj) => {
          const err = errorObj.message;
          this.setState({ authErr: err });
        }
      );
  }

  showSidebar = () => {
    this.setState((state) => ({ openMobileMenu: !state.openMobileMenu }));
  }

  goToLecturePage = (event) => {
    this.setState({ lecture: event })
    let id = event.extendedProps.lectureId;
    this.props.history.push(`/lectures/${id}`);
  }

  render() {
    // compose value prop as object with user object and logout method
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout
    }
    return (
      <AuthContext.Provider value={value}>

        <Header showSidebar={this.showSidebar} />

        <Container fluid>

          <Switch>
            <Route path="/login">
              <Row className="vheight-100">
                <Col sm={4}/>
                <Col sm={4} className="below-nav">
                  <LoginForm />
                </Col>
              </Row>
            </Route>

            <Route path="/calendar">
              <CalendarPage goToLecturePage={this.goToLecturePage} authUser={value.authUser}/>
            </Route>

            <Route path="/lectures/:lecture_id" render={(props) =>
              <LecturePage lecture_id={props.match.params.lecture_id} />
            } />

            <Route>
              <Redirect to='/login'/>
            </Route>
            
          </Switch>

        </Container>
      </AuthContext.Provider>
    );
  }
}

export default withRouter(App);
