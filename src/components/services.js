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
class Services extends React.Component {

  constructor(props) {
    super(props);

    
    this.state = {
      agents : [],
      selectedAgent: undefined,
      offset:0,
      open:false,
      visible:false
     
    };

    
    this.watchRegistriesTimer = undefined;
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.openModal1 = this.openModal1.bind(this)
    this.closeModal1 = this.closeModal1.bind(this)
   
  }


  openModal (){
    this.setState({ open: true })
  }
  closeModal () {
    this.setState({ open: false })
  }

  openModal1 (){
    this.setState({ visible: true })
  }
  closeModal1 () {
    this.setState({ visible: false })
  }

  getAgentButtonText(state, agent) {
    
    
    if (this.props.account) {
      if (typeof state.selectedAgent === 'undefined' || state.selectedAgent.key !== agent.key) {
        return state == AGENT_STATE.ENABLED ? 'Create Job' : 'Agent Disabled';
      } else {
        return 'Selected';
      }
    } else {
      return 'Unlock account';
    }
  }

  componentWillMount() {
    this.watchRegistriesTimer = setInterval(() => this.watchRegistries(), 500);
    //this.watchRegistries()
  }

  componentWillUnmount() {
    clearInterval(this.watchRegistriesTimer);
  // this.watchRegistries()
  }

  hexToAscii(hexString) { 
    let asciiString = Eth.toAscii(hexString);
    return asciiString.substr(0,asciiString.indexOf("\0")); // name is right-padded with null bytes
  }

  getServiceRegistrations(registry) {
    return registry.listOrganizations()
      .then(({ orgNames }) =>
        Promise.all(orgNames.map(orgName => Promise.all([ Promise.resolve(orgName), registry.listServicesForOrganization(orgName) ])))
      )
      .then(servicesByOrg => {
        const nonEmptyServiceLists = servicesByOrg.filter(([ , { serviceNames } ]) => serviceNames.length);
        return Promise.all(
          nonEmptyServiceLists.reduce((acc, [ orgName, { serviceNames } ]) =>
            acc.concat(serviceNames.map(serviceName => Promise.all([
              Promise.resolve(orgName),
              registry.getServiceRegistrationByName(orgName, serviceName)
            ])))
          , [])
        );
      })
      .then(servicesList =>
        Promise.resolve(servicesList.map(([ orgName, { name, agentAddress, servicePath } ]) => ({ orgName, name, agentAddress, servicePath })))
      )
      .catch(console.error);
  };

  watchRegistries() {
    if(typeof this.props.registries !== "undefined" && this.props.agentContract) {
      Promise.all([
        typeof this.props.registries["AlphaRegistry"] !== "undefined" ? this.props.registries["AlphaRegistry"].listRecords() : undefined,
        typeof this.props.registries["Registry"] !== "undefined" ? this.getServiceRegistrations(this.props.registries["Registry"]) : undefined
      ])
      .then(([ alphaRegistryListing, registryListing ]) => {
        let agents = [];

        if (typeof alphaRegistryListing !== "undefined") {  
          alphaRegistryListing[0].map((input, index) => {
            const asciiName = this.hexToAscii(input);

            const thisAgent = {
              "name": asciiName,
              "address": alphaRegistryListing[1][index],
              "key": [ alphaRegistryListing[1][index], asciiName ].filter(Boolean).join("/"),
            };

            if (thisAgent.name !== "" && thisAgent.address !== STRINGS.NULL_ADDRESS) {
              agents.push(thisAgent);
            }
          });
        }

        if (typeof registryListing !== "undefined") {
          registryListing.forEach(({ orgName, name, agentAddress, servicePath }) => {
            const serviceAsciiName = this.hexToAscii(name);
            const serviceAsciiPath = this.hexToAscii(servicePath);
            const orgAsciiName = this.hexToAscii(orgName);

            const serviceIdentifier = [ orgAsciiName, serviceAsciiPath, serviceAsciiName ].filter(Boolean).join("/");
            
            const thisAgent = {
              "name": serviceIdentifier,
              "address": agentAddress,
              "key": [ agentAddress, serviceIdentifier ].filter(Boolean).join("/")
            };

            if (thisAgent.name !== "" && thisAgent.address !== STRINGS.NULL_ADDRESS) {
              agents.push(thisAgent);
            }
          });
        }

        let promises = [];
        
        promises.push(fetch('/featured.json').then(response => response.json()))

        for(let agent in agents) {
          let agentInstance = this.props.agentContract.at(agents[agent].address);
          agents[agent]['contractInstance'] = agentInstance;

          let statePromise    = agentInstance.state();
          let pricePromise    = agentInstance.currentPrice();
          let endpointPromise = agentInstance.endpoint();
          promises.push(statePromise, pricePromise, endpointPromise);

          Promise.all([statePromise, pricePromise, endpointPromise]).then(values => {
            agents[agent]['state']        = values[0][0];
            agents[agent]['currentPrice'] = values[1][0];
            agents[agent]['endpoint']     = values[2][0];
            
          });
        }

        Promise.all(promises).then(([featured]) => {
          if (this.props.network) {
            let otherAgents = []
            this.setState({
              agents: Object.assign(
                {},
                {
                  featured: Object.values(agents).filter(agent => {
                    const test = featured.includes(agent.address)
                    if (test) {
                      return test
                    } else {
                      otherAgents.push(agent)
                    }
                  }),
                  other: otherAgents
                }
              )
            })
          } else {
            this.setState({
              agents: []
            })
          }
        });
      });
    }
  }

  handleClick(offset) {
    this.setState({ offset });
  }


  render() {
    /*Agents name*/
    let agentsample =[ {
      'agentname':'Face_Recognition',price:'0.01'
    },
    {
      'agentname':'Document_Recognition',price:'0.00001'
    },
    {
      'agentname':'Text_Recognition',price:'0.0001'
    }
  ]
  /*sample agents name*/
    let otheragents = Object.values(this.state.agents);
    let featuredagents = otheragents.splice(0,1); //featured agents
    console.log(otheragents)
    let arraylimit = otheragents.map(row => row.length)
    let kyid = 0
    const agents = otheragents.map(row => row.slice(this.state.offset, this.state.offset + 5).map(rown => <div className="media d-flex flex-row p-3 border bg-light mb-3" key={kyid++}>
    <div className="col-3 align-self-center" >
    <a href="#"  className="link-agent-details d-block" onClick={this.openModal1}> 
                      <img className="mr-3 img rounded-circle" src="img/agent.png" alt="Generic placeholder img"/>
                      <span className="m-0">{rown.name.toUpperCase()}</span>
                      </a>
    </div>
    <Popover
                    placement="right"
                    container= {this}
                    show={this.state.visible}
                    onHide={this.closeModal1}
                    hideWithOutsideClick={true}
                    style={{width:'620px',height:'850px' }}>
                  <div >
                <a href="javascript:void(0)" className="closebtn" >&times;</a>
                <div className="right-panel agentdetails-sec p-3 pb-5">
                    <div className="name border-bottom m-2">
                        <h3><span className="m-0">{rown.name.toUpperCase()}</span></h3>
                        <p>Beta-Dapp Agent
                            <a href="#" className="d-block">Expand</a></p>
                        <button type="button" className="btn  btn-outline-primary btn-curved-singularity ">Tag name1</button>
                        <button type="button" className="btn   btn-outline-primary btn-curved-singularity">Tag name2</button>
                        <div className="button-startjob pt-1 pb-3 d-flex justify-content-end">
                        <Button variant="contained"  color={rown.state == AGENT_STATE.ENABLED ? 'primary' : 'danger'} disabled={ !(rown.state == AGENT_STATE.ENABLED) || typeof this.props.account === 'undefined' || typeof rown.state.selectedAgent !== 'undefined' } onClick={() => { this.setState({ selectedAgent: rown }); return this.props.onAgentClick(rown); }} >
                            { this.getAgentButtonText(rown.state, rown.agent) }
                        </Button>                                         
                        </div>

                    </div>
                    <div className="address border-bottom m-2 pb-3">
                        <h3 className="pt-3">Contract address</h3>
                        <div className="row">
                            <div className="col-6">
                                <p> <label className="m-0">
                              <a target="_blank" href={this.props.network && typeof NETWORKS[this.props.network] !== "undefined" ? `${NETWORKS[this.props.network].etherscan}/address/${rown.address}` : undefined}>
    
                                {FORMAT_UTILS.toHumanFriendlyAddressPreview(rown.address)}</a>
                              </label> </p>
                            </div>
                            <div className="col-6 text-center border-left"><i className="fas fa-user"></i>
                                <p className="text-uppercase">Developer Name</p>
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
                                <label className="m-0">{AGI.toDecimal(rown.currentPrice)}  ETH</label>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-sm bg-light  p-2">
                                    End Point
                                </div>
                                <div className="col-sm text-right bg-lighter ">
                                    <label className="m-0">{rown.endpoint} </label>
                                    
                                </div>

                            </div>
                        </div>


                    </div>
                    <div className="agenthealth border-bottom m-2">
                        <h3 className="pt-3">Agent Health</h3>
                        <div className="d-flex chart p-3">
                            <img src="img/chart-dummy.png" title="chart" className="img img-responsive" />

                        </div>
                    </div>
                    <div className="input m-2">
                        <h3 className="pt-3">Input Sample</h3>
                        <form>
                            <div className="form-group">

                                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" style={{width:"100%"}}></textarea>
                            </div>
                        </form>

                    </div>
                    <div className="input m-2">
                        <h3 className="pt-3">Output Sample</h3>
                        <form>
                            <div className="form-group">

                                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" style={{width:"100%"}}></textarea>
                            </div>
                        </form>
                        <button type="button" className="btn btn-lg  btn-outline-primary btn-curved-singularity align-self-right">Run
                            Sample</button>
                    </div>


                </div>

            </div>
      </Popover>


    <div className="col-3 align-self-center">

  <label className="m-0">{AGI.toDecimal(rown.currentPrice)}  ETH</label>
</div>

 


    </div>))

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
                    <Popup
                    open={this.state.open}
                    trigger = {  <IconButton color="inherit"  onClick={this.openModal}>
                    <img className="user-img rounded-circle m-2" src="img/user.png"/>
                    </IconButton>}
                    closeOnDocumentClick
                    onClose={this.closeModal}
                    position="left top" offsetX="10"  contentStyle={{width:'420px'}}>
                  
                    <Account network={this.props.network} account={this.props.account} ethBalance={this.props.ethBalance} agiBalance={this.props.agiBalance} />
                
                  </Popup>
                      
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
           //allServicesTable()
    )
   

}
}

export default Services;
