import React, { useEffect, useState } from "react";
import "../style.css";
import "./step1.css";
import { MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Option } from '@mui/base/Option';
import InputAdornment from '@mui/material/InputAdornment';
import professions from "../../constants/professions";
import residence from "../../constants/residence";
import maritalState from "../../constants/marital";
import ownership from "../../constants/carowner";
import cities from "../../constants/cities";
import states from "../../constants/states";
import predict from "../functions";

import { useNavigate } from "react-router-dom";

function Step1(props){

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

    const navigate = useNavigate()

    useEffect(
        () => {
            var parsedIncome = +income
            setIncomeError( isNaN(parsedIncome) )
            console.log( incomeError + " - " + parsedIncome )
        },
        [income]
    )

    const updateUserData = () => {
        props.setUserData( {
            "Age" : age,
            "Experience" : experience,
            "Residency Duration" : residencyDuration,
            "Residency Type" : (residenceStatus === 1) ? "Rented" : ((residenceStatus === 2) ? "Owned" : "None"),
            "Profession" : "no",//professions.find( (element) => {return element[1]===profession} )[0],
            "Current Experience" : currentExperience,
            "Income" : income,
            "Marital Status" : (maritalStatus===0?"Married":"Single"),
            "Car Owner?" : (carOwnerStatus===0?"Don't own a car":"Own a car")
        } )
    }

    const redirectToStep2 = () => { 
        navigate("/step2")
    }

    const predict = (data) => {

        fetch('http://localhost:5050/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(prediction => {
            console.log('Prediction: ' + (""+prediction));
            var pred = parseFloat((""+prediction).split(",")[0])
            console.log( pred )
            if( pred > 0.7 )
            {
                console.log( 1 )
                setPredictionClass(1)
            }
            else if( pred < 0.6 )
            {
                console.log( 3 )
                setPredictionClass(3)
            }
            else
            {
                console.log( 2 )
                setPredictionClass(2)
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setPredictionClass(4)
        });
    }
    

    const showPredictionMessage = () => {
        if( predictionClass == 3 )
        {
            console.log("Showing 1")
            return (       
            <Alert severity="warning">
            <AlertTitle>Oops</AlertTitle>
            Unfortunately our system has <strong>denied</strong> your application. Please try again later.
            </Alert>
                    )
        }
        else if( predictionClass == 2 )
        {
            console.log("Showing 2")
            return (       
            <Alert severity="info">
            <AlertTitle>Notice</AlertTitle>
            Our system has determined that your application will require <strong>additional scrutiny</strong>. Please proceed further with our AI assistant.
            <div className="Custom-Button Button-Width-90pc Button-Height-5vh Button-Inactive-White Button-Active-Gray Horizontal-Align-Center"
                onClick={redirectToStep2}>
                Continue with AI Assistant
                </div>
            </Alert>
                    )
        }
        else if( predictionClass == 1 )
        {
            console.log("Showing 3")
            return (       
            <Alert severity="success">
            <AlertTitle>Good news!</AlertTitle>
            Our system has <strong>approved</strong> your application! Please move forward with your loan application!
            </Alert>
                    )
        }
        else if( predictionClass == 4 )
        {
            console.log("NONE")
            return ( <Alert severity="warning">
            <AlertTitle>Oops</AlertTitle>
            Local python flask server not detected. Due to technical limitations of free hosting, the python flask server has to be run locally. Please download and execute the provided flask server source code!
            </Alert> )
        }
        else {
            return ( <div></div> )
        }


    }

    const analyseData = () => {
        
        var data = {
            'Income': income,
            'Age': age,
            'Experience': experience,
            'Married/Single': maritalStatus,
            'House_Ownership': residenceStatus,
            'Car_Ownership': carOwnerStatus,
            'CURRENT_JOB_YRS': currentExperience,
            'CURRENT_HOUSE_YRS': residencyDuration,
            'Profession_count': profession,
            'CITY_count': city,
            'STATE_count': state
        }

        setPredictionClass( predict(data) )
        updateUserData()

    }

    return (<div className="Main-Container Step1-Background">
            <h1 className="Step1-Subheading">Step 1</h1>
            <h1 className="Step1-Heading">Quantitative Eligibility Evaluation</h1>
            <div className="Step1-Form-Container">
                <p className="Step1-Form-Text">Fill in the following form to proceed with quantitative analysis of your prospects and loan application eligibility analysis!</p>
                <div className="Horizontal-Divider Divider-Gray Divider-Width-75pc"/>
                <h1 className="Step1-Subheading">Applicant Information Form</h1>

                <div className="Spacer-Height39px" />

                <div className="Step1-Row-Container">
                    <p className="Step1-Field-Label">Age</p>
                    <OutlinedInput fullWidth size="small"
                                endAdornment={<InputAdornment position="start">years</InputAdornment>}
                                value={age}
                                onChange={ (element) => { !isNaN(+element.target.value) && setAge(element.target.value)} }
                                //error={incomeError}
                    />
                </div>


                <div className="Step1-Row-Container">
                    <p className="Step1-Field-Label">Marital Status</p><Select fullWidth size="small"
                                value={maritalStatus}
                                onChange={ (element) => {setMaritalStatus(element.target.value)} }
                    >
                        { maritalState.map(  (value,index) => {
                            return <MenuItem value={value[1]}>{value[0]}</MenuItem>
                        } ) }
                    </Select>
                </div>




                <div className="Step1-Row-Container">
                    <p className="Step1-Field-Label">Car Ownership</p><Select fullWidth size="small"
                                value={carOwnerStatus}
                                onChange={ (element) => {setCarOwnerStatus(element.target.value)} }
                    >
                        { ownership.map(  (value,index) => {
                            return <MenuItem value={value[1]}>{value[0]}</MenuItem>
                        } ) }
                    </Select>
                </div>



                <div className="Step1-Row-Container">
                    <p className="Step1-Field-Label">Residence</p><Select fullWidth size="small"
                                value={residenceStatus}
                                onChange={ (element) => {setResidenceStatus(element.target.value)} }
                    >
                        { residence.map(  (value,index) => {
                            return <MenuItem value={value[1]}>{value[0]}</MenuItem>
                        } ) }
                    </Select>
                </div>


                <div className="Step1-Row-Container">
                    <p className="Step1-Field-Label">Residency Duration</p>
                    <OutlinedInput fullWidth size="small"
                                endAdornment={<InputAdornment position="start">years</InputAdornment>}
                                value={residencyDuration}
                                onChange={ (element) => { !isNaN(+element.target.value) && setResidencyDuration(element.target.value)} }
                                //error={incomeError}
                    />
                </div>



                <div className="Step1-Row-Container">
                    <p className="Step1-Field-Label">Profession</p><Select fullWidth size="small"
                                value={profession}
                                onChange={ (element) => {setProfession(element.target.value)} }
                    >
                        { professions.map(  (value,index) => {
                            return <MenuItem value={value[1]}>{value[0]}</MenuItem>
                        } ) }
                    </Select>
                </div>
            

                <div className="Step1-Row-Container">
                    <p className="Step1-Field-Label">Total Experience</p>
                    <OutlinedInput fullWidth size="small"
                                endAdornment={<InputAdornment position="start">years</InputAdornment>}
                                value={experience}
                                onChange={ (element) => { !isNaN(+element.target.value) && setExperience(element.target.value)} }
                                //error={incomeError}
                    />
                </div>


                <div className="Step1-Row-Container">
                    <p className="Step1-Field-Label">Current Experience</p>
                    <OutlinedInput fullWidth size="small"
                                endAdornment={<InputAdornment position="start">years</InputAdornment>}
                                value={currentExperience}
                                onChange={ (element) => { !isNaN(+element.target.value) && setCurrentExperience(element.target.value)} }
                                //error={incomeError}
                    />
                </div>

                <div className="Step1-Row-Container">
                    <p className="Step1-Field-Label">Income</p><OutlinedInput fullWidth size="small"
                                startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                                value={income}
                                onChange={ (element) => {setIncome(element.target.value)} }
                                error={incomeError}
                    />
                </div>


                <div className="Step1-Row-Container">
                    <p className="Step1-Field-Label">City</p><Select fullWidth size="small"
                                value={city}
                                onChange={ (element) => {setCity(element.target.value)} }
                    >
                        { cities.map(  (value,index) => {
                            return <MenuItem value={value[1]}>{value[0]}</MenuItem>
                        } ) }
                    </Select>
                </div>
            

                <div className="Step1-Row-Container">
                    <p className="Step1-Field-Label">State</p><Select fullWidth size="small"
                                value={state}
                                onChange={ (element) => {setState(element.target.value)} }
                    >
                        { states.map(  (value,index) => {
                            return <MenuItem value={value[1]}>{value[0]}</MenuItem>
                        } ) }
                    </Select>
                </div>
            

                <div className="Spacer-Height39px" />



                <div className="Custom-Button Button-Width-60pc Button-Height-5vh Button-Inactive-White Button-Active-Gray Horizontal-Align-Center"
                onClick={analyseData}>
                Check Eligibility!
                </div>

                <div className="Step1-Full-Width Horizontal-Align-Center">
                {
                    showPredictionMessage()
                }
                </div>
            
            </div>
    </div>)
}

export default Step1