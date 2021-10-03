import { Button, Popover, Spin } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Card } from "antd";
import { format } from "date-fns";
import { Link, Redirect } from "react-router-dom";
import "./card.scss"
import likeIcon from './pictures/like-icon.svg'
import likedIcon from './pictures/liked-icon.svg'
import warningIcon from './pictures/warning-icon.svg'
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { setFullArticle, editArticle, deleteArticle, likeArticle, unlikeArticle, fetchFullArticle, toggleLikeArticle } from "../FullArticle/FullArticleSlice";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { favouriteArticleInList } from "../ArticlesList/articlesListSlice";


const MyCard = ({article, loading, setFullArticle, isFullArticle, isLoggedIn, currentUser, removeArticle, toggleLikeArticle, likeArticle, unlikeArticle, favouriteArticleInList}:any) => {

    const {title, createdAt, tagList, description, author, favoritesCount, slug, body, favorited} = article
    const { username: authorUsername, image } = author
    const isOwner = currentUser === authorUsername
    const [deleteForm, setDeleteForm] : [false|string, any] = useState(false)
    const packageForList = {
        slug,
        favorited,
        favoritesCount
    }
    const hideDeleteForm = () => {
        setDeleteForm(false)
    }
    const showDeleteForm = () => {
        setDeleteForm('visible')
    }

    const delArticle = () => {
        removeArticle(slug) 
    }

    const tags:any[] =
        tagList.length ?
            tagList
                .map(
                    (tag:string) =>
                        <Button size="small" key={Math.round(Math.random()*1000)}>
                            {tag}
                        </Button>
                ) : 'No tags'
    const colorClassName = !isFullArticle ? 'card__synopsis--black' : 'card__synopsis--grey'            
    const date = format(new Date(createdAt), 'MMMM d, yyyy')
    const bodyHtml = <ReactMarkdown children={body} remarkPlugins={[remarkGfm]}/>   
    const loadedCard = 
        <React.Fragment>
            {slug === 'initial-mockup' && <Redirect to="/"/>}
            <div className="card--upper">
                <div className="card--left">
                    <div className="card__header">
                        <div className="card__header--left">
                            <Link 
                                to={`/article/${slug}`} 
                                className="card__title" 
                                onClick={() => {
                                    setFullArticle()
                                    }}>{title}</Link>
                            <div className="card__likes">
                                <img 
                                    className="like-icon" 
                                    src={favorited ? likedIcon : likeIcon} 
                                    alt="like" 
                                    onClick={
                                        () => {
                                            if (isLoggedIn) !favorited ? 
                                            likeArticle(slug) && toggleLikeArticle() && favouriteArticleInList(packageForList) : 
                                                unlikeArticle(slug) && toggleLikeArticle() && favouriteArticleInList(packageForList)}}/>
                                <span>{favoritesCount}</span>
                            </div>
                        </div>
                    </div>
                    <div className="card__tags">
                        {tags}
                    </div>
                    <div className={`card__synopsis ${colorClassName}`}>
                        {<ReactMarkdown children={description} remarkPlugins={[remarkGfm]}/>}
                    </div>
                </div>
                <div className="card--right">
                    <div className="card-author">
                        <div className="card__user">
                            <p className="card__name">{authorUsername}</p>
                            <p className="card__date">{date}</p>
                        </div>
                        
                        <img className="card__avatar" src={image} alt="user avatar"/>
                    </div>
                    {(isFullArticle && isOwner) && <div className="card-btns">
                        <Popover 
                            placement="rightTop" 
                            content={
                                <div className="delete-form">
                                    <div className="delete-form__content">
                                        <img src={warningIcon} alt="warning"/>
                                        <span>Are you sure you want to delete this article?</span>
                                    </div>
                                    <div className="delete-form__btns">
                                        <button type="button" onClick={hideDeleteForm}>No</button>
                                        <button type="button" onClick={delArticle}>Yes</button>
                                    </div>
                                </div>
                        }
                            visible={deleteForm} 
                            trigger='click'
                            onVisibleChange={showDeleteForm}
                        >
                            <button className="card-btns__delete">Delete</button>
                        </Popover>
                        
                        <Link to={`/article/${slug}/edit`}>
                            <button className="card-btns__edit">Edit</button>
                        </Link>
                    </div>}  
                </div>
            </div>
            <div className="card__text">{isFullArticle && bodyHtml}</div>
        </React.Fragment>

    const spinner = <Spin size="large"/>
    

   return (
    <Card className="article-card">
        {!loading ? loadedCard : spinner}
    </Card>
)}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    const bound = bindActionCreators({setFullArticle, editArticle, deleteArticle, toggleLikeArticle, fetchFullArticle, likeArticle, unlikeArticle, favouriteArticleInList }, dispatch)
    return {
        setFullArticle: bound.setFullArticle,
        removeArticle: bound.deleteArticle,
        toggleLikeArticle: bound.toggleLikeArticle,
        fetchFullArticle: bound.fetchFullArticle,
        likeArticle: bound.likeArticle,
        unlikeArticle: bound.unlikeArticle,
        favouriteArticleInList: bound.favouriteArticleInList
        
    }
}

const mapStateToProps = (state: { app: { currentUser: { username: string; }; isLoggedIn: boolean; }; }) => ({
    currentUser: state.app.currentUser.username,
    isLoggedIn: state.app.isLoggedIn
})


export default connect(mapStateToProps, mapDispatchToProps)(MyCard)