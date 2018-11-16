import React from 'react';
import PropTypes from 'prop-types';
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
import Slide from '@material-ui/core/Slide';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';

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

const ModalStyles1={
  position:'relative',
  background: 'white',
  borderRadius: 3,
  border: 5,
  color: 'white',
  height: 930,
  width: 450,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px gray',
  left: 1480,
  top:65,
}
const ModalStyles2={
  position:'relative',
  background: 'white',
  borderRadius: 3,
  border: 5,
  color: 'white',
  height: 190,
  width: 1850,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px gray',
  left: 20,
  top:69,
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
      open2:false,
      userprofile:[],
      uservote:[],
      userservicestatus:[],
      serviceid:0,
      modaluser:{},
      tagsall:[],
      searchterm:'',
      bestestsearchresults:[],
      besttagresult:[],
  
     
    };
    
   this.onOpenModal = this.onOpenModal.bind(this)
   this.onCloseModal = this.onCloseModal.bind(this)
   this.onOpenModal1 = this.onOpenModal1.bind(this)
   this.onCloseModal1 = this.onCloseModal1.bind(this)
   this.onOpenModal2 = this.onOpenModal2.bind(this)
   this.onCloseModal2 = this.onCloseModal2.bind(this)
   this.handlesearch = this.handlesearch.bind(this)
   this.startjob = this.startjob.bind(this)
   this.CaptureSearchterm = this.CaptureSearchterm.bind(this)
   this.handlesearchbytag = this.handlesearchbytag.bind(this)
    
  }
 
  componentDidMount(){
     this.setState({useraddress:this.props.account})
    
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
//update existing//
  

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
  onOpenModal1(e,data) {
  
    this.setState({tagsall:data["tags"]})
    this.setState({modaluser:data})
  
    this.setState({ open1: true });
  }

  onCloseModal1(){
    this.setState({ open1: false });
  };
  onOpenModal2(e) {
    //alert(e.target.id)
    
    this.setState({ open2: true });
    
  };
  onCloseModal2(){
    this.setState({ open2: false });
  };
  startjob()
  {
    alert("starting the job..." + this.state.serviceid)
    
  }
  handlesearch()
  {
    
    //search on service_name, display_name and all tags//
    this.setState({besttagresult:[]})
     let searchedagents =[]
     searchedagents =this.state.agents.map(row => (row["display_name"].toUpperCase().indexOf(this.state.searchterm.toUpperCase()) !== -1 || row["service_name"].toUpperCase().indexOf(this.state.searchterm.toUpperCase()) !== -1)?row:null )
     let bestsearchresults = [...(searchedagents.filter(row => row !== null).map(row1 => row1))]
     this.setState({bestestsearchresults:bestsearchresults})
   
  }
  handlesearchbytag(e,data)
  {
    //remove null//
    let tagresult = []
    
    this.state.agents.map(rowagents => 
    (rowagents["tags"].map(rowtag =>(rowtag===data)?tagresult.push(rowagents):null))
   )
    //inner loop trap//
    this.setState({besttagresult:tagresult})
  
     //console.log(tagresult)
     //later put this back in the this.state.agents here//
     //check for status on tags later//
  }
  CaptureSearchterm(e)
  {
    this.setState({searchterm:e.target.value})
  }
  render() {
    /*Agents name*/
    const { open } = this.state;
    var agentsample = this.state.agents
    
    if (this.state.searchterm !== '' )
    {
      //this.setState({besttagresult:[]})
      agentsample = this.state.bestestsearchresults
    }
    
    if (this.state.besttagresult.length>0)
    {
      //this.setState({searchterm:''})
      agentsample = this.state.besttagresult
    }
    
    let uservotes = [this.state.uservote]
   
    
    let servicestatus = this.state.userservicestatus
    let arraylimit = agentsample.length
    agentsample.map(row => {row["up_vote"]=0,row["down_vote"]=0})
    this.state.agents.map(row =>
      this.state.uservote.map(rown => ((rown["service_name"]===row["service_name"]&& rown["organization_name"]===row["organization_name"])?
                                         ((rown["up_vote"]===1?row["up_vote"]=1:row["up_vote"]=0)||(rown["down_vote"]===1?row["down_vote"]=1:row["down_vote"]=0)):null)
 )
 )

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
    //push new array of object has those upvote and downvote//
   ((rown["up_vote"]===0 && rown["down_vote"]===0)?
  
      <div><ThumbUp color="disabled" style={{ fontSize: 20 }}/><ThumbDown color="disabled" style={{ fontSize: 20 }}/></div>:
      (rown["up_vote"]===1 && rown["down_vote"]===0)?
  
      <div><ThumbUp color="disabled" style={{ fontSize: 20 }}/><ThumbDown color="primary" style={{ fontSize: 20 }}/></div>:
    
      (rown["up_vote"]===0 && rown["down_vote"]===1)?
  
      <div><ThumbUp color="disabled" style={{ fontSize: 20 }}/><ThumbDown color="secondary" style={{ fontSize: 20 }}/></div>:
    
      
      null)
    

  }

</div>

  <div className="col-3 align-self-center">
  {servicestatus.map(row =>  ((row["service_id"]===rown["service_id"])?
                             ((row["is_available"] ===1)? <div><VolumeUp color="primary" /></div>: <div><VolumeDown color="secondary"/></div>)
                             :null)
  )}
  <br/>
  <Button variant="contained"  color="primary" onClick={(e)=>this.onOpenModal1(e,rown)} id={rown["service_id"]}>Details</Button>
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
                         
                        <form className="navbar-form pl-4 " role="search" refs ="endtarget">
                            <div className="input-group add-on">
                                <input className="form-control" placeholder="Search" name="srch-term" id="srch-term" type="text" value={this.state.searchterm} />
                                
                                <div className="input-group-btn">
                                    <button type="button" className="btn-search-pop btn btn-lg "  onClick={this.onOpenModal2} >
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
           <Button variant="contained" color="secondary" onClick={this.onCloseModal} >Close</Button>
         </div>
       </Modal>
 </div>
 <div>
 
 <Modal
         open={this.state.open1}
         onClose={this.onCloseModal1}
       >
        
           <Slide direction="left" in={this.state.open1} mountOnEnter unmountOnExit>
         <div style={ModalStyles1} >
           <Typography variant="subtitle1" id="simple-modal-description">
           <div className="right-panel agentdetails-sec p-3 pb-5">
                    <div className="name border-bottom m-2">
                        <h3>{this.state.modaluser["service_name"]}</h3>
                        <p>Description for Agent here...
                            <a href="#" className="d-block">Expand</a></p>
                           <p> {this.state.tagsall.map(rowtags => <button type="button" className="btn  btn-outline-primary btn-curved-singularity ">{rowtags}</button>)}</p>
                          
                        <div className="button-startjob pt-1 pb-3 d-flex justify-content-end"><button type="button" className="btn btn-singularity btn-md " onClick={this.startjob}>Start
                                a
                                Job</button></div>
                    </div>
                    <div className="address border-bottom m-2 pb-3">
                        <h3 className="pt-3">User address</h3>
                        <div className="row">
                            <div className="col-6">
                                <p> <label className="m-0">
                              <a target="_blank" href={this.props.network && typeof NETWORKS[this.props.network] !== "undefined" ? `${NETWORKS[this.props.network].etherscan}/address/${this.props.account}` : undefined}>
                              {this.props.account}
                                </a>
                              </label> </p>
                            </div>
                            <div className="col-6 text-center border-left">
                                <p className="text-uppercase">{this.state.modaluser["organization_name"]}</p>
                            </div>
                        </div>
                    </div>
                    <div className="jobcostpreview border-bottom m-2">
                        <h3 className="pt-3">Job Cost Preview</h3>

                        <div className="container p-3">
                            <div className="row mb-1">
                                <div className="col-sm bg-light p-2">
                                    Current Price
                                </div>
                                <div className="col-sm text-right bg-lighter ">
                                {this.state.modaluser["price"]}
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-sm bg-light  p-2">
                                    Price Model
                                </div>
                                <div className="col-sm text-right bg-lighter ">
                                {this.state.modaluser["price_model"]}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
             </Typography>
            
           <Button variant="contained" color="secondary" onClick={this.onCloseModal1} >Close</Button>
         </div>
         </Slide>
        
       </Modal>
      
       
 </div>
 <div>
 <Modal
         open={this.state.open2}
         onClose={this.onCloseModal2}
       >
        <Slide direction="down" in={this.state.open2} mountOnEnter unmountOnExit>
         <div style={ModalStyles2} >
           <Typography variant="subtitle1" id="simple-modal-description">
           <div className='row'>
                                            <div className='col rborder '> <form role='form'>
                                                    <div className='form-group'> 
                                                            <h3><label  className='text-uppercase d-block'>Search</label></h3>
                                                      <input className='headerSearch search-query form-control d-inline' id='str' name='str' type='text' value={this.state.searchterm} onChange={this.CaptureSearchterm} />                                                    
                                                      <Button variant="contained" color="primary" onClick={this.handlesearch} >Search</Button>
                                                     
                                                    </div>
                                                  </form></div>
                                              
                                            <div className='col ml-3'><h3>Tags</h3>
                                            <nav className='tags-section'>
                                            {this.state.agents.map(rowagents => rowagents["tags"].map(rowtag => <a className='btn btn-outline-primary btn-curved-singularity p-2 mr-3' href='#' onClick={(e)=>{this.handlesearchbytag(e,rowtag)}}>{rowtag}</a>))}
                                                
                                                      </nav></div>
                                        </div>
             </Typography>
             <Button variant="contained" color="secondary" onClick={this.onCloseModal2} >Close</Button>
         </div>
         </Slide>
       </Modal>

       
 </div>
</main> 
</React.Fragment>       
    )
}
}

export default SampleServices;
