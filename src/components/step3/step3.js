import React, { useEffect, useRef, useState } from "react";
import "../style.css";
import "./step3.css";

import { MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import professions from "../../constants/professions";
import residence from "../../constants/residence";
import maritalState from "../../constants/marital";
import ownership from "../../constants/carowner";
import cities from "../../constants/cities";
import states from "../../constants/states";
import { useNavigate } from "react-router-dom";

function Step3(props){

    const agentMessages = [
        "Hi! How may I help you?",
        "Alright! First I need some basic information such as the kind of loan you'd like to apply for!",
        "That's great. Our Qualitative and quantitative analysis have determined that you may be eligible for a loan at our bank. I'd just like to ask you a few questions regarding certain parameters of your application."
    ]

    const [ agentMessagesIndex , setAgentMessagesIndex ] = useState(0)

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

    const [ incomeError , setIncomeError ] = useState(false)
    const [ predictionClass , setPredictionClass ] = useState(0)

    const [count , setCount] = useState(0)
    const [ messages , setMessages ] = useState([])

    const navigate = useNavigate()

    const generateDetails = () => {
        return (
            <div className="Step3-Details-Container">

        <h1 className="Step3-Details-Text Step3-Text-White">
            Age : {props.userData["Age"]}
        </h1>
        
        <h1 className="Step3-Details-Text Step3-Text-White">
            Total Experience : {props.userData["Total Experience"]} Years
        </h1>
        
        <h1 className="Step3-Details-Text Step3-Text-White">
            Residency Type : {props.userData["Residency Type"]}
        </h1>
        
        <h1 className="Step3-Details-Text Step3-Text-White">
            Residency Duration : {props.userData["Residency Duration"]} Years
        </h1>

        <h1 className="Step3-Details-Text Step3-Text-White">
            Profession : {props.userData["Profession"]}
        </h1>
        
        <h1 className="Step3-Details-Text Step3-Text-White">
            Current Experience : {props.userData["Current Experience"]} Years
        </h1>
        
        <h1 className="Step3-Details-Text Step3-Text-White">
            Income : {props.userData["Income"]}
        </h1>
        
        <h1 className="Step3-Details-Text Step3-Text-White">
            Marital Status : {props.userData["Marital Status"]}
        </h1>
        
        <h1 className="Step3-Details-Text Step3-Text-White">
            Car Owner? : {props.userData["Car Owner?"]}
        </h1>
    
       </div> )
    }

    const keyPress = (e) => {
        if(e.keyCode == 13){
           console.log('value', e.target.value);
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

    useEffect( () => {
        if( messages[0] && messages[0]["role"] !== "assistant" )
        {
              setTimeout( () => {
                  setMessages( [ { "role" : "assistant" , "content" : agentMessages[agentMessagesIndex] } , ...messages ] )
                  setAgentMessagesIndex( agentMessagesIndex+1 )
              } , 1500 )
        }
    } , [messages] )

    return (<div className="Main-Container Step3-Background">

            <div className="Step3-Text-Container">
            <h1 className="Step3-Subheading">Step 3</h1>
            <h1 className="Step3-Heading">Human Agent Evaluation</h1>
            <h1 className="Step3-Form-Text Step3-Text-White">
            As you've been deemed as a possible candidate to avail a loan from our bank despite not meeting certain criteria, we've escalated your application to a loan agent. Please continue your application process by speaking with our agent using the chat window on the right!
            </h1>
            <div className="Horizontal-Divider Divider-White Divider-Width-75pc"/>
            <h1 className="Step3-Subheading">Your Details</h1>
            
            {
                generateDetails()
            }
            
            </div>
            
            <div className="Step3-Form-Container">
                
                <div className="Step3-Bot-Header">
                    <div className="Step3-Bot-Icon" />
                    <h1 className="Step3-Subheading">Loan Agent</h1>
                </div>

                <div className="Step3-Chat-Window" ref={chatscroll}>

                <TextField onKeyUp={ keyPress }/>

                {
                    messages.map( (element, index) => {
                        return <div key={index} className={element["role"]==="user"?"Step3-Chat-Client-Message":"Step3-Chat-Agent-Message"}>{element["content"]}</div>
                    } )
                }

                </div>
                
            </div>
    </div>)

}

export default Step3