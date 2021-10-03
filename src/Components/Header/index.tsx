import { Button } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { user } from "../../TypeScrtipt/types";
import { logOut } from "../App/appSlice";
import { fetchArticlesList, loadArticles } from "../ArticlesList/articlesListSlice";
import './header.scss'



const Header = ({isLoggedIn, currentUser, logOut, loadArticles}:any) => {
    const signInBtn = !isLoggedIn &&
        <Link to="/sign-in">
            <Button className="sign-in-btn">Sign In</Button>
        </Link>
    const signUpBtn = !isLoggedIn &&
        <Link to="/sign-up">
            <Button className="sign-up-btn">Sign Up</Button>
        </Link>

    const createNewArticle = isLoggedIn &&
        <Link to="/new-article">
            <Button className="create-article-btn">Create article</Button>
        </Link>
    
    const profile = isLoggedIn &&
        <Link to='/profile' className="current-user">
            <span className="username">{currentUser.username}</span>
            <img className="avatar" src={currentUser.image} alt="user avatar"/> 
        </Link>

    const LogOutBtn = isLoggedIn && <Button className="logout-btn" onClick={() => {logOut()}}>Log out</Button>    
    
    return (
    <header className="header">
        <Link to="/" onClick={() => loadArticles()}><h2 className="header__title">Realworld Blog</h2></Link>
        <div className="header-btns">
            {signInBtn}
            {signUpBtn}
            {createNewArticle}
            {profile}
            {LogOutBtn}
        </div>
    </header>
)}


const mapStateToProps = (state: { app: { isLoggedIn: boolean; currentUser: user; }; }) => ({
    isLoggedIn: state.app.isLoggedIn,
    currentUser: state.app.currentUser,
})
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    const bound = bindActionCreators({logOut, fetchArticlesList, loadArticles}, dispatch)

    return {
        logOut: bound.logOut,
        loadArticles: bound.loadArticles,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header)