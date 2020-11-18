import React from 'react';
import './App.css';
import Header from './components/Header';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from './components/LoginForm';
import LecturePage from './components/LecturePage';
import API from './api/API';
import { Redirect, Route, Link } from 'react-router-dom';
import { Switch } from 'react-router';
import { AuthContext } from './auth/AuthContext';
import { withRouter } from 'react-router-dom';
import CalendarPage from './components/CalendarPage';

class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = { lecture: { title: "" }, filter: 'all',  };
  }

  componentDidMount() {
    //check if the user is authenticated
    /* API.isAuthenticated().then(
      (user) => {
        this.setState({authUser: user});
      }
    ).catch((err) => { 
      this.setState({authErr: err.errorObj});
      this.props.history.push("/login");
    }); */
  }

  handleErrors(err) {
    if (err) {
      if (err.status && err.status === 401) {
        this.setState({ authErr: err.errorObj });
        this.props.history.push("/login");
      }
    }
  }

  // Add a logout method
  logout = () => {
    API.userLogout().then(() => {
      this.setState({ authUser: null, authErr: null, tasks: null });
      API.getTasks().catch((errorObj) => { this.handleErrors(errorObj) });
    });
  }

  // Add a login method
  login = (username, password) => {
    API.userLogin(username, password)
    .then((user)=>{
      this.setState({ authUser: user, authErr: null });
      this.props.history.push("/calendar");
    }).catch(
      (errorObj) => {
        const err0 = errorObj.errors[0];
        this.setState({ authErr: err0 });
      }
    );
  }

  showSidebar = () => {
    this.setState((state) => ({ openMobileMenu: !state.openMobileMenu }));
  }



  goToLecturePage = (event) => {
    this.setState({ lecture: event })
    this.props.history.push("/lecture/");
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
                <Col sm={4}></Col>
                <Col sm={4} className="below-nav">
                  <LoginForm />
                </Col>
              </Row>
            </Route>

            <Route path="/calendar">
              <CalendarPage goToLecturePage={this.goToLecturePage} />
            </Route>
            <Route path="/lectures/:lecture_id" render={(props)=>
              <LecturePage lecture_id={props.match.params.lecture_id}/>
            }/>

            <Route>
              <Redirect to='/login'></Redirect>
            </Route>

          </Switch>

        </Container>
      </AuthContext.Provider>
    );
  }
}

export default withRouter(App);
