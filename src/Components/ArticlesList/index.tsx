/* eslint-disable react-hooks/exhaustive-deps */
import { AnyAction, bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import { Alert, Pagination, Spin } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import MyCard from "../Card";
import { fetchArticlesList, changePage, loadArticles, articlesList } from "./articlesListSlice";
import "./ArticlesList.scss"
import { article } from "../../TypeScrtipt/types";



const ArticlesList = ({articlesList, articlesTotal, currentPage, loading, fetchArticlesList, changePage, error}:any) => {
    const articlesCards = 
        articlesList
            .map((article:article) => 
                <MyCard 
                    article={article} 
                    key={Math.round(Math.random()*1000)}
                    loading={loading}
                />)
    const warningMsg = <Alert type="warning" className="cards-warning" message="Oops! Something went wrong. Try again later!"/>
    const pagination = !error && !loading && 
        <Pagination 
            className="pagination"
            current={currentPage}
            showSizeChanger={false}
            total={articlesTotal}
            hideOnSinglePage 
            onChange={(page:number) => {
                changePage(page)
                fetchArticlesList(page*5-5)
            }}
        />

    const spinner = <Spin size="large"/>
    
    useEffect(()=> {
        
       loading && fetchArticlesList()
    }, [loading])

    return (
        <React.Fragment>
            {!articlesCards.length && loading && spinner}
            {!error ? articlesCards : warningMsg}
            {pagination}
        </React.Fragment>
    )
}

const mapStateToProps = (state: { articlesList: articlesList }) => ({
    articlesList: state.articlesList.list,
    articlesTotal: state.articlesList.articlesTotal,
    currentPage: state.articlesList.currentPage,
    loading: state.articlesList.loading,
    error: state.articlesList.error, 
})
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    const actions = {
        fetchArticlesList,
        changePage,
        loadArticles,
    }
    const bound = bindActionCreators(actions, dispatch)  
    return {
        fetchArticlesList: bound.fetchArticlesList,
        changePage: bound.changePage,
        loadArticles: bound.loadArticles,
    }
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesList)