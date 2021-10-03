/* eslint-disable react-hooks/exhaustive-deps */

import Header from "../Header";
import ArticlesList from "../ArticlesList";
import FullArticle from "../FullArticle";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './app.scss'
import SignUp from "../SignUp";
import SignIn from "../SignIn";
import EditAccount from "../EditAccount";
import ArticleForm from "../ArticleForm";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { fetchCurrentUser } from "./appSlice";
import { useEffect } from "react";
import { Alert } from "antd";
import { article } from "../../TypeScrtipt/types";

const App = ({ fetchCurrentUser } : any) => {
    useEffect(
        ()=> {
            localStorage.getItem('token')
            fetchCurrentUser()
    }, []
)
    return (
        <Router>
            <Header/>
            <div className="content">
                <Switch>
                    <Route path={['/', '/articles']} exact component={ArticlesList}/>
                    <Route path='/article/:id' exact render= {({match}) => {
                        const { id } = match.params
                        return <FullArticle slug={id}/>
                    }}/>
                    <Route path="/sign-up" component={SignUp}/>
                    <Route path="/sign-in" component={SignIn}/>
                    <Route path="/profile" component={EditAccount}/>
                    <Route path="/new-article" render= {() => <ArticleForm mode="new"/>}/>
                    <Route path='/article/:id/edit' render= {() => {
                        return <ArticleForm mode="editing"/>
                    }}/>
                    <Route render={()=> <Alert type="warning" message="Sorry, we couldn't find this page."/>}/>
                </Switch>
            </div>       
        </Router>
    )
}

const mapStateToProps = (state: { fullArticle: { article: article; }; app: { isLoggedIn: boolean; }; }) => ({
    article: state.fullArticle.article,
    isLoggedIn: state.app.isLoggedIn
})
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    const bound = bindActionCreators({fetchCurrentUser}, dispatch)
    return {
        fetchCurrentUser: bound.fetchCurrentUser
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)





/*
App
    Header
        Title
        Sign Up
        Sign In
    Content
        Cards
            card x5
                title
                likes
                tags
                synopsis
                name
                date
                avatar
            pagination
        Article
            title
            tags
            synopsis
            text
        New Account Form
            title
            username
            email
            password
            repeat password
            agreement
            submit
            exsisting account
        Sign In Form
            title
            email
            password
            submit
            no account
        Edit Profile
            title
            email
            new password
            avatar image
            submit














*/