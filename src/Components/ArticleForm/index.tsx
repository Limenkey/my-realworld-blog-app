import { Card } from "antd"
import React, { useState } from "react"
import './articleform.scss'
import { useForm } from "react-hook-form"
import { connect } from "react-redux"
import { AnyAction, bindActionCreators, Dispatch } from "redux"
import { createNewArticle, updateArticle } from "../FullArticle/FullArticleSlice"
import { Redirect } from "react-router"
import { article } from "../../TypeScrtipt/types"


const ArticleForm = ({mode, article, createNewArticle, updateArticle, isLoggedIn}:any) => {
    const {register, getValues, setValue, handleSubmit, formState:{errors}} = useForm()
    const isNew = mode === 'new' 
    const header = isNew ? 'Create new article' : 'Edit article'
    const {title, description, body, tagList, slug} = article
    const tagInputs : any[] = []
    tagList.forEach((el:string, index:number)=> tagInputs.push({id: index+1, text: el}))
    const [tags, setTags] = useState(tagInputs)
    const [success, setSuccess] = useState(false)

    const addTag = (text:string) => {
        setTags(() => [...tags, {id:Math.round(Math.random() * 1000), text}])
    }
    const deleteTag = (id:number) => {
        setTags(
            tags.filter(
                (item:{id:number, name:string}) => item.id !== id
            )
        )
    }
    const tagsBlock = tags.map((tag:{id:number, text:string}) => (
        <div className="tag" key={`${tag.id}`}>
            <input type="text" placeholder="Tag" defaultValue={tag.text} disabled/>
            <button className="delete-btn" type="button" onClick={() => deleteTag(tag.id)}>Delete</button>
        </div>
    ))

    const onSubmit = async (data:article) => {
        const {title, description, body} = data
        const tagsData:string[] = []
        tags.forEach(tag => tagsData.push("" + tag.text))
        const dataPackage:article = {
                "title" : title,
                "description" : description,
                "body" : body,
                "tagList": [...tagsData],
                "slug": slug,
        }
        isNew ? await createNewArticle({"article" : dataPackage}) : await updateArticle({"article" : dataPackage})
        setSuccess(true)
    }


    return (
        <React.Fragment>
            {success && <Redirect to={`/article/${slug}`}/>}
            {!isLoggedIn && <Redirect to="/sign-in"/>}
            <Card className="article">
                <h2>{header}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Title</label>
                    <input type="text" defaultValue={!isNew ? title : ''} placeholder="Title" {...register('title', {required: 'Title is required'})}/>
                    {errors.title && <p className="error-msg">{errors.title.message}</p>}

                    <label>Short description</label>
                    <input type="text" defaultValue={!isNew ? description : ''} placeholder="Short description" {...register('description', {required: 'Description is required'})}/>
                    {errors.description && <p className="error-msg">{errors.description.message}</p>}

                    <label>Text</label>
                    <textarea placeholder="Text" defaultValue={!isNew ? body : ''} {...register('body', {required: 'This field can\'t be empty'})}></textarea>
                    {errors.body && <p className="error-msg">{errors.body.message}</p>}

                    <label>Tags</label>
                    {tagsBlock}
                    <div className="tag new-tag" key={`new-tag`}>
                        <input type="text" placeholder="Tag" {...register(`new-tag`)}/>
                        <button 
                            className="add-tag-btn" 
                            type="button" 
                            onClick={
                                () => {
                                    addTag(getValues('new-tag'))
                                    setValue('new-tag', '')
                                }
                            }>
                            Add tag
                        </button>
                    </div>
                    
                    <button className="send-btn" type="submit">Send</button>

                </form>
                
            </Card>
        </React.Fragment>
    )
}

ArticleForm.defaultProps = {
    mode: 'new',
    article: {
        title: '',
        description: '',
        body: '',
        tagList: []
    }
}

const mapStateToProps = (state: { fullArticle: { article: { slug: string } }; app: { isLoggedIn: boolean } }) => ({
    article: state.fullArticle.article,
    slug: state.fullArticle.article.slug,
    isLoggedIn: state.app.isLoggedIn,
})
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    const bound = bindActionCreators({createNewArticle, updateArticle}, dispatch)
    return {
        createNewArticle: bound.createNewArticle,
        updateArticle: bound.updateArticle,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ArticleForm)