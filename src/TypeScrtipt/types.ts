export interface article {
    slug: string,
    title: string,
    description: string,
    body: string,
    createdAt?: string,
    updatedAt?: string,
    tagList?: string[],
    author?: author,
    comments?: [],
    favorited?: boolean,
    favoritesCount?: number,
}

export interface author {
    username: string,
    bio: null | string,
    image: string,
}

export interface user {
    username?: string,
    email: string,
    bio?: null | string,
    password: null | string,
    image?: string,
    token?: string,
    error?: boolean,
    loading?: boolean,
}