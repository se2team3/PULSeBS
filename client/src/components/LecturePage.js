import React from 'react';

class LecturePage extends React.Component {
    constructor(props) {
      super(props);
      this.state={lecture:this.props.lecture}
    }

    render(){
        return (
            <h1 className={"below-nav"}>{this.state.lecture.title}</h1>
        )
    }

}  

export default LecturePage