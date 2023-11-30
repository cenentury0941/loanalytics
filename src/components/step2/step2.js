import React, { useEffect, useRef, useState } from "react";
import "../style.css";
import "./step2.css";

import { MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import professions from "../../constants/professions";
import residence from "../../constants/residence";
import maritalState from "../../constants/marital";
import ownership from "../../constants/carowner";
import cities from "../../constants/cities";
import states from "../../constants/states";
import { useNavigate } from "react-router-dom";

import OpenAI from "openai";
import { getkey , getAssistantId } from "../../constants/aiapi";

const openai = new OpenAI({ apiKey: getkey(), dangerouslyAllowBrowser: true } );

const thread = await openai.beta.threads.create();

// const message = await openai.beta.threads.messages.create(
//     thread.id,
//     {
//       role: "user",
//       content: "I need to check my eligibility for a loan."
//     }
//   );


function Step2(props){

    // console.log(props.userData)

    const [ income , setIncome ] = useState(0)
    const [ age , setAge ] = useState(0)
    const [ experience , setExperience ] = useState(0)
    const [ residencyDuration , setResidencyDuration ] = useState(0)
    const [ currentExperience , setCurrentExperience ] = useState(0)
    const [ profession , setProfession ] = useState("")
    const [ city , setCity ] = useState("")
    const [ state , setState ] = useState("")
    const [ residenceStatus , setResidenceStatus ] = useState("")
    const [ maritalStatus , setMaritalStatus ] = useState("")
    const [ carOwnerStatus , setCarOwnerStatus ] = useState("")
    var lastMessage = ""

    const [ incomeError , setIncomeError ] = useState(false)
    const [ showProceed , setShowProceed ] = useState(false)
    const [ predictionClass , setPredictionClass ] = useState(0)

    const [count , setCount] = useState(0)
    const [ messages , setMessages ] = useState([])

    var run = null

    const updateChat = async (new_message) => {
        console.log("Updating")
        const message_obj = await openai.beta.threads.messages.create(
            thread.id,
            {
            role: "user",
            content: new_message
            }
        );

        run = await openai.beta.threads.runs.create(
            thread.id,
            { 
              assistant_id: getAssistantId(),
            }
          );
          setTimeout( checkRunStatus , 1000 )
    }

    const checkRunStatus = async () => {
        var run_local = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
          );

        if(run_local.status === "completed")
        {
            const messages = await openai.beta.threads.messages.list(
                thread.id
              );
            //console.log(messages.body.data)
            setMessages( messages.body.data.map( (element) => { return {"role":element.role,"content":element.content[0].text.value} } ) )
        }
        else if(run_local.status === "requires_action")
        {
            console.log(run_local)
            var args = JSON.parse( run_local.required_action.submit_tool_outputs.tool_calls[0].function.arguments )
            setMessages( [{"role":"assistant", "content":args.closing_message}, { "role" : "user" , "content" : lastMessage } , ...messages] )
            setShowProceed( args.escalate_issue )
        }
        else
        {
            console.log("loading")
            setTimeout( checkRunStatus , 1000 )
        }
    }

    const navigate = useNavigate()

    const generateDetails = () => {
        return (
            <div className="Step2-Details-Container">

        <h1 className="Step2-Details-Text Step2-Text-White">
            Age : {props.userData["Age"]}
        </h1>
        
        <h1 className="Step2-Details-Text Step2-Text-White">
            Total Experience : {props.userData["Total Experience"]} Years
        </h1>
        
        <h1 className="Step2-Details-Text Step2-Text-White">
            Residency Type : {props.userData["Residency Type"]}
        </h1>
        
        <h1 className="Step2-Details-Text Step2-Text-White">
            Residency Duration : {props.userData["Residency Duration"]} Years
        </h1>

        <h1 className="Step2-Details-Text Step2-Text-White">
            Profession : {props.userData["Profession"]}
        </h1>
        
        <h1 className="Step2-Details-Text Step2-Text-White">
            Current Experience : {props.userData["Current Experience"]} Years
        </h1>
        
        <h1 className="Step2-Details-Text Step2-Text-White">
            Income : {props.userData["Income"]}
        </h1>
        
        <h1 className="Step2-Details-Text Step2-Text-White">
            Marital Status : {props.userData["Marital Status"]}
        </h1>
        
        <h1 className="Step2-Details-Text Step2-Text-White">
            Car Owner? : {props.userData["Car Owner?"]}
        </h1>
    
       </div> )
    }

    const keyPress = (e) => {
        if(e.keyCode == 13){
           console.log('value', e.target.value);
            lastMessage = e.target.value
           if( e.target.value === "next" )
           {
                navigate("/step3")
                return
           }
           updateChat(e.target.value)
           setMessages( [ { "role" : "user" , "content" : e.target.value } , ...messages ] )
           e.target.value = ""
        }
     }

    const chatscroll = useRef(null)

    useEffect(() => {
        if (chatscroll) {
            chatscroll.current.addEventListener('DOMNodeInserted', event => {
            const { currentTarget: target } = event;
            target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
          });
        }
      }, [])

    return (<div className="Main-Container Step2-Background">

            <div className="Step2-Text-Container">
            <h1 className="Step2-Subheading">Step 2</h1>
            <h1 className="Step2-Heading">Qualitative Eligibility Evaluation</h1>
            <h1 className="Step2-Form-Text Step2-Text-White">
            Our system has determined that your application will require additional scrutiny. Please converse with our AI assistant regarding the concerns.
            </h1>
            <div className="Horizontal-Divider Divider-White Divider-Width-75pc"/>
            <h1 className="Step2-Subheading">Your Details</h1>
            
            {
                generateDetails()
            }
            
            </div>
            
            <div className="Step2-Form-Container">
                
                <div className="Step2-Bot-Header">
                    <div className="Step2-Bot-Icon" />
                    <h1 className="Step2-Subheading">Loanalytics AI Assistant</h1>
                </div>

                <div className="Step2-Chat-Window" ref={chatscroll}>

                <TextField onKeyUp={ keyPress }/>

                { showProceed &&
                <div className="Custom-Button Button-Width-60pc Button-Height-10vh Button-Inactive-White Button-Active-Gray Horizontal-Align-Center"
                onClick={()=>{ navigate("/step3") }}>
                Proceed with Loan Agent!
                </div>
                }

                {
                    messages.map( (element) => {
                        return <div className={element["role"]==="user"?"Step2-Chat-Client-Message":"Step2-Chat-Agent-Message"}>{element["content"]}</div>
                    } )
                }

                </div>
                
            </div>
    </div>)

}

export default Step2