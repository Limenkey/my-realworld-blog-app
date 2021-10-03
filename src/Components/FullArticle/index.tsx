/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchFullArticle, closeFullArticle} from "./FullArticleSlice";
import './fullarticle.scss'
import { Alert, Spin } from "antd";
import MyCard from "../Card";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { article } from "../../TypeScrtipt/types";


const FullArticle = ({loading, error, isFullArticle, slug, article, fetchFullArticle, closeFullArticle}:any) => {

    
    
    useEffect(() => {
        loading && fetchFullArticle(slug)
        return () => {
            closeFullArticle()
        }
    }, [])

          
        const loaded = !loading && !error &&
            <React.Fragment>
                <MyCard 
                    article={article} 
                    loading={loading} 
                    error={error} 
                    isFullArticle={isFullArticle} 
                />
            </React.Fragment>

        const spinner = loading && !error && <Spin size="large"/>
        const errorMsg = !loading && error && <Alert type="warning" message="Oops, something went wrong! Try again later."/>   
    return (
        <React.Fragment>
            {loaded}
            {spinner}
            {errorMsg}
        </React.Fragment>
    )
}



const mapStateToProps = (state: { fullArticle: { loading: boolean; error: boolean; article: article; isFullArticle: boolean; }; }) => ({
    loading: state.fullArticle.loading,
    error: state.fullArticle.error,
    article: state.fullArticle.article,
    isFullArticle: state.fullArticle.isFullArticle
})
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    const bound = bindActionCreators(
        {
            fetchFullArticle,
            closeFullArticle,
        }, dispatch
    )

    return {
        fetchFullArticle: bound.fetchFullArticle,
        closeFullArticle: bound.closeFullArticle,
    }    
}



export default connect(mapStateToProps, mapDispatchToProps)(FullArticle)