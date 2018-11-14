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
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { relative } from 'path';
import ThumbUp from '@material-ui/icons/thumbup';
import ThumbDown from '@material-ui/icons/thumbdown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeDown from '@material-ui/icons/VolumeDown';
import Chip from '@material-ui/core/Chip';

const ModalStyles={
  position:'relative',
  background: 'white',
  borderRadius: 3,
  border: 5,
  color: 'white',
  height: 260,
  width: 450,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px gray',
  left: 1420,
  top:75,
}

const profilestyle={
  padding:'10 40px',
}
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
        height: 38,
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
      show:false,
      divclicker: 0,
      open:false,
      open1:false,
      userprofile:[],
      uservote:[],
      useraddress:'',
      userservicestatus:[],
      serviceid:0,
     
    };
    //this.handledivclick = this.handledivclick.bind(this)
    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
   // this.handleProfile = this.handleProfile.bind(this)
   this.onOpenModal1 = this.onOpenModal1.bind(this)
   this.onCloseModal1 = this.onCloseModal1.bind(this)
    
  }
  componentDidMount(){

    this.setState({useraddress:'0xCasddedeasdadaddaddaddad'})
    let _url = 'https://ltgukzuuck.execute-api.us-east-1.amazonaws.com/stage/service'
    fetch(_url,{'mode':'cors',
    'Access-Control-Allow-Origin':'*'})
    .then(res => res.json())
    .then(data => this.setState({agents:data}))
    //.then(data => this.setState({agents:JSON.parse(data['body'])}))
  //fetchprofile service
    let _urlfetchprofile = 'https://ltgukzuuck.execute-api.us-east-1.amazonaws.com/stage/fetch-profile'
    fetch(_urlfetchprofile,{'mode':'cors',
    headers: {
      "Content-Type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify({user_address:'0xCasddedeasdadaddaddaddad'})
    }
    //user_address to change after metamask account address//
    )
    .then(res => res.json())
    .then(data => this.setState({userprofile:data}))
    .catch(err => console.log(err))
    //fetch upvotedownvote

    let _urlfetchvote = 'https://ltgukzuuck.execute-api.us-east-1.amazonaws.com/stage/fetch-vote'
    fetch(_urlfetchvote,{'mode':'cors',
    headers: {
      "Content-Type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify({user_address:'0xCasddedeasdadaddaddaddad'})
    }
    //user_address to change after metamask account address//
    )
    .then(res => res.json())
    .then(data => this.setState({uservote:data}))
    .catch(err => console.log(err))

  

  //fetch signal lite https://ltgukzuuck.execute-api.us-east-1.amazonaws.com/stage/fetch-service-status

  let _urlfetchservicestatus = 'https://ltgukzuuck.execute-api.us-east-1.amazonaws.com/stage/servicestatus'
    fetch(_urlfetchservicestatus,{'mode':'cors',
    method: 'GET',
    'Access-Control-Allow-Origin':'*',
    }
    //user_address to change after metamask account address//
    )
    .then(res => res.json())
    .then(data => this.setState({userservicestatus:data}))
   //.then(data => console.log(data))
    .catch(err => console.log(err))
   
  }
  handleClick(offset) {
    this.setState({ offset });
  }
  onOpenModal() {
    this.setState({ open: true });
  };
  onCloseModal(){
    this.setState({ open: false });
  };
  onOpenModal1(e) {
    this.setState({ open1: true });
    alert(e.target.id)
  };
  onCloseModal1(){
    this.setState({ open1: false });
  };
  render() {
    /*Agents name*/
    const { open } = this.state;
    let agentsample = this.state.agents
    let uservotes = this.state.uservote
    let specificuser =  uservotes.filter(row => row.user_address === this.state.useraddress)
    let servicestatus = this.state.userservicestatus
    let arraylimit = agentsample.length
    let _showthumbs = false
    let count =0
    let kyid = 0
    const agents = agentsample.slice(this.state.offset, this.state.offset + 5).map((rown,index) => <div className="media d-flex flex-row p-3 border bg-light mb-3" key={index} id={rown["service_id"]} name={rown["display_name"].toUpperCase()} >
    <div className="col-3 align-self-center" id={rown["service_id"]} name={rown["display_name"].toUpperCase()}>
    <a href="#"  className="link-agent-details d-block"  > 
                      <img className="mr-3 img rounded-circle" src="img/agent.png" alt="Generic placeholder img"/>
                      <span className="m-0">{rown["display_name"].toUpperCase()}</span>
    </a>
    </div>
  <div className="col-3 align-self-center">
    <label className="m-0">{rown["price"]}  ETH</label>
  </div>
  <div className="col-3 align-self-center">
  {
     specificuser.map(row =>  
      ((row["service_name"]===rown["service_name"] && row["organization_name"] === rown["organization_name"] )? 
                     (row["up_vote"] ===1)? <div><ThumbUp color="primary" style={{ fontSize: 20 }} /><ThumbDown color="disabled" style={{ fontSize: 20 }}/></div>:null ||
                        (row["down_vote"]===1)?<div><ThumbUp color="disabled" style={{ fontSize: 20 }}/><ThumbDown color="secondary" style={{ fontSize: 20 }}/></div> :null||
                        (row["up_vote"] === 0 && row["down_vote"] === 0)?<div><ThumbUp color="disabled" style={{ fontSize: 20 }}/><ThumbDown color="disabled" style={{ fontSize: 20 }}/></div>:null
                        :null
                         )
  )}

</div>

  <div className="col-3 align-self-center">
  {servicestatus.map(row =>  ((row["service_id"]===rown["service_id"])?
                             ((row["is_available"] ===1)? <div><VolumeUp color="primary" /></div>: <div><VolumeDown color="secondary"/></div>)
                             :null)
  )}
  <br/>
  <Button variant="contained"  color="primary" onClick={this.onOpenModal1} id={rown["service_id"]}>Details</Button>
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
                    <img className="user-img rounded-circle m-2" src="img/user.png" onClick={this.onOpenModal}/>
         
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
<div>
      <Modal
         open={this.state.open}
         onClose={this.onCloseModal}
       >
         <div style={ModalStyles} >
           <Typography variant="subtitle1" id="simple-modal-description">
           {this.state.userprofile.map((row,index) => 
              <div key={index} style={profilestyle}><p>Sender:{row.sender}, Balance: {row.balance} ETH</p>
              <p><span>Channels</span><span>Pending</span><span>Balance</span></p>
              {row.channels.map(row => <p><span>{row.channel_id}</span><span>{row.pending} ETH</span><span>{row.balance} ETH</span></p>)}
              </div>
               
            )}
             </Typography>
           <Button variant="contained" onClick={this.onCloseModal} >Close</Button>
         </div>
       </Modal>
 </div>
 <div>
      <Modal
         open={this.state.open1}
         onClose={this.onCloseModal1}
       >
         <div style={ModalStyles} >
           <Typography variant="subtitle1" id="simple-modal-description1">
           <div>do do do do do do do do do do </div>
             </Typography>
           <Button onClick={this.onCloseModal1}>Close</Button>
         </div>
       </Modal>
 </div>
</main> 
</React.Fragment>       
    )
}
}
export default SampleServices;
