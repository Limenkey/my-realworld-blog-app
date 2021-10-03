import { article, user } from "../TypeScrtipt/types"

const token = localStorage.getItem('token')
const isLoggedIn = !!token


class realworldService {
    adress:string = 'https://conduit.productionready.io/api/'


    getArticles = async (offset:number = 0) => {
        let req
        if (isLoggedIn) {
        req = await fetch(`${this.adress}articles?limit=5&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
        }) 
        } else req = await fetch(`${this.adress}articles?limit=5&offset=${offset}`)
        const res = await req.json()
        return res    
    }

    getFullArticle = async (slug:string) => {
        let req
        if (isLoggedIn) {
            req = await fetch(`${this.adress}articles/${slug}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
            }) 
    } else req = await fetch(`${this.adress}articles/${slug}`)
    return await req.json() 
    }

    getCurrentUser = async () => {
        const req = await fetch(`${this.adress}user`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
        })
        return await req.json()
    }

    signUp = async (user:{ user: user}) => {
        const req = await fetch(`${this.adress}users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        return await req.json()
    }
    signIn = async (user:{ user: user}) => {
        const req = await fetch(`${this.adress}users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        return await req.json()
    }

    editProfile = async (user:{}) => {
        const req = await fetch(`${this.adress}user`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        return await req.json()
    }
    createNewArticle = async(article:{article:article}) => {
        const req = await fetch(`${this.adress}articles`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(article),
        })
        return await req.json()
    }
    deleteArticle = async(slug:string) => {
        const req = await fetch(`${this.adress}articles/${slug}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
        })   
        return req.json()
    }
    editArticle = async (data:{ article: article }) => {
        const {slug} = data.article
        const req = await fetch(`${this.adress}articles/${slug}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        
        const res = await req.json()
        return res
    }
    likeArticle = async (slug:string) => {
        const req = await fetch(`${this.adress}articles/${slug}/favorite`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
            },
        })
        return await req.json()
    }
    unlikeArticle = async (slug : string) => {
        const req = await fetch(`${this.adress}articles/${slug}/favorite`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
            },
        })
        return await req.json()
    } 
}


const service = new realworldService()

export default service