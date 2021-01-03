import React from 'react';
import './App.css';
import Header from './components/Header';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from './components/LoginForm';
import LecturePage from './components/LecturePage';
import SetupPage from './components/SetupPage';
import API from './api';
import { Route} from 'react-router-dom';
import { Switch } from 'react-router';
import { AuthContext } from './auth/AuthContext';
import { withRouter } from 'react-router-dom';
import CalendarPage from './components/CalendarPage';
import StatisticsPage from './components/StatisticsPage';


class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = { lecture: { title: "" }, filter: 'all', };
  }

  componentDidMount() {
    API.isAuthenticated()
    .then((user) => {
        this.setState({ authUser: user });
      }
    ).catch((err) => {
      this.setState({ authErr: err.errorObj, authUser: null });
      this.props.history.push("/login");
    });
  }

  handleErrors(err) {
    if (err) {
      if (err.status && err.status === 401) {
        API.isAuthenticated().then(
          (user) => {
            this.setState({ authUser: user });
          }
        ).catch((err2) => {
          this.setState({ authErr: err2.errorObj, authUser: null });
          this.props.history.push("/login");
        });
      }
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.    
    this.handleErrors(error);
  }

  /*componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service  
    console.log(error);
    console.log(errorInfo);
    this.handleErrors(error);
  }*/

  // Add a logout method
  logout = () => {
    API.userLogout().then(() => {
      this.setState({ authUser: null, authErr: null });
      this.props.history.push("/login");
    });
  }

  // Add a login method
  login = (username, password) => {
    API.userLogin(username, password)
      .then((user) => {
        this.setState({ authUser: user, authErr: null });
        if(user.role === 'manager')
          this.props.history.push("/statistics")
        else if(user.role === 'officer')
          this.props.history.push("/setup")
        else this.props.history.push("/calendar");
        console.log(this.props.history);
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
    if( this.state.authUser!==undefined) console.log("in app"+this.state.authUser.role)
    return (
      <AuthContext.Provider value={value}>

        <Header showSidebar={this.showSidebar} />

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

            <Route path="/statistics">
              <StatisticsPage authUser={value.authUser}/>
            </Route>

            <Route path="/lectures/:lecture_id" render={(props) =>
              <LecturePage lecture_id={props.match.params.lecture_id} />
            } />
            
            {(value.authUser&&value.authUser.role==="officer")&&<Route path="/setup">
              <SetupPage/>
            </Route>}
            <Route>
              Not found
            </Route>
            
          </Switch>
      </AuthContext.Provider>
    );
  }
}

export default withRouter(App);
