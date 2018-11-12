import React from 'react';
import Eth from 'ethjs';
import {NETWORKS, AGENT_STATE, AGI, FORMAT_UTILS, STRINGS} from '../util';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Pagination from "material-ui-flat-pagination";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Popup from 'reactjs-popup';
import Account from "./account.js";
import Popover from 'react-simple-popover';


const theme = createMuiTheme({
  overrides: {
    // Name of the component ⚛️ / style sheet
    MuiButton: {
      // Name of the rule
      root: {
        // Some CSS
        background: 'white',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px lightblue',
      },
    },
  },
});
class SampleServices extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      agents : [],
      selectedAgent: undefined,
      offset:0,
     
    };

  }

  componentDidMount(){
    let _url = 'https://ltgukzuuck.execute-api.us-east-1.amazonaws.com/stage/service'
    fetch(_url,{'mode':'cors',
    'Access-Control-Allow-Origin':'*'})
    .then(res => res.json())
    .then(data => this.setState({agents:JSON.parse(data['body'])}))
    
  }

  handleClick(offset) {
    this.setState({ offset });
  }

  render() {
    /*Agents name*/
    let agentsample = this.state.agents
    let arraylimit = agentsample.length
    let kyid = 0
    const agents = agentsample.slice(this.state.offset, this.state.offset + 5).map(rown => <div className="media d-flex flex-row p-3 border bg-light mb-3" key={kyid++}>
    <div className="col-3 align-self-center"  >
    <a href="#"  className="link-agent-details d-block" onClick={this.openModal1}> 
                      <img className="mr-3 img rounded-circle" src="img/agent.png" alt="Generic placeholder img"/>
                      <span className="m-0">{rown["service_name"].toUpperCase()}</span>
    </a>
    </div>
    <div className="col-3 align-self-center">
  <label className="m-0">{rown["price"]}  ETH</label>
</div>
    </div>)

    return(
    <React.Fragment>
      <nav className="site-header sticky-top py-1">
            <div className="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="logo-wrapper ">
                <a href="#"><i className="icon-logo-singularity"></i></a>
              </div>
                <div className="header-right-pnl  d-flex  justify-content-around">
                    <div className="seach-pnl d-flex  justify-content-around align-items-center ">
                        <a className="btn-discover btn btn-primary mr-4" href="#">Discover</a>
    
                        <form className="navbar-form pl-4 " role="search" refs ="endtarget">
                            <div className="input-group add-on">
                                <input className="form-control" placeholder="Search" name="srch-term" id="srch-term" type="text"/>
                                <div className="input-group-btn">
                                    <button type="button" className="btn-search-pop btn btn-lg " >
                                    <i className="fa fa-search"></i>
                                    </button>
    
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="loggeduser-pnl" >
                    <IconButton color="inherit" >
                    <img className="user-img rounded-circle m-2" src="img/user.png"/>
                    </IconButton>
                      
                    </div>
                </div>
                </div>
        </nav>

<main role="content" className="content-area">
<div className="container-fluid p-4  ">
      <div className="justify-content-between p3">
                <h4 className="align-self-center text-uppercase mb-0 ">All Agents</h4>        
      <div>
    {agents}
     <div className="pagination pagination-singularity  pt-3 d-flex justify-content-end">
      <MuiThemeProvider theme={theme}> 
        <Pagination
          limit={5}
          offset={this.state.offset}
          total={arraylimit}
          onClick={(e, offset) => this.handleClick(offset)}
        />
     </MuiThemeProvider>
     </div>
     </div>
     </div>
</div>
</main> 
</React.Fragment>       
    )
}
}

export default SampleServices;
