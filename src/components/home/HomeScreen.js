import React from "react"
import "./HomeScreen.css"
import "../style.css"
import { useNavigate } from "react-router-dom"

function HomeScreen(){

    const navigate = useNavigate()

    const redirectToGithub = () => {
        window.location.href = "https://github.com/cenentury0941/loanalytics"
    }

    const redirectToStep1 = () => {
        navigate("/step1")
    }

    return(<div className="Main-Container">
        <div className="Loanalytics-Logo"></div>
        <div className="Container-Width35">
        <p className="HomeScreen-Text">
                Want to apply for a loan?
            </p>
            <div className="Custom-Button Button-Width-60pc Button-Height-7pc Button-Inactive-Gray Button-Active-White"
            onClick={redirectToStep1}>
                Check your eligibility now!
            </div>
            <div className="Horizontal-Divider Divider-White Divider-Width-75pc"/>
            <p className="HomeScreen-Text">
                Want to view the code?
            </p>
            <div className="Custom-Button Button-Width-60pc Button-Height-7pc Button-Inactive-Gray Button-Active-White"
                onClick={redirectToGithub}>
                Visit the Repo
            </div>
        </div>
    </div>)
}

export default HomeScreen