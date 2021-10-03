import { Card } from "antd"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { user } from "../../TypeScrtipt/types";
import { clearServerErrors, updateUserData } from "../App/appSlice";
import './editaccount.scss'


interface editProfileForm {
    username: string,
    email: string,
    password?: string,
    image: string,
}


const EditProfile = ({user, updateProfile, serverErrors, clearServerErrors, isLoggedIn}:any) => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [success, setSuccess] = useState(false)
    const onSubmit = (data:editProfileForm) => {
        const {password, ...rest} = data
        clearServerErrors()
        getValues('password') ? updateProfile({'user': data}) : updateProfile({'user': rest})
        !serverErrors && setSuccess(true)
    }
    return (
        <React.Fragment>
            {!isLoggedIn && <Redirect to="/sign-in"/>}
            <Card className="form profile"> 
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1>Edit Profile</h1>
                    <div className="inputs">
                        <label>Username</label>
                        <input
                            className={errors.username && 'input--error'} 
                            type="text"
                            defaultValue={user.username} 
                            placeholder="Username"
                            {...register('username', {
                                required: 'Username is required', 
                                minLength: {
                                    value: 3,
                                    message: 'Username must be at least 3 characters long'
                                }, 
                                maxLength: {
                                    value: 20,
                                    message: 'Username can\'t be longer than 20 characters'
                                },
                            })}
                        />
                        {errors.username && <p className="error-msg">{errors.username.message}</p>}
                        {serverErrors.username && <p className="error-msg">{`This username ${serverErrors.username}`}</p>}

                        <label>Email address</label>
                        <input
                            className={errors.email && 'input--error'} 
                            type="email"
                            defaultValue={user.email} 
                            placeholder="Email adress"
                            {...register('email', {required: 'Email is required'})}
                        />
                        {errors.email && <p className="error-msg">{errors.email.message}</p>}
                        {serverErrors.email && <p className="error-msg">{`This email ${serverErrors.email}`}</p>}

                        <label>New password</label>
                        <input 
                            className={errors.password && 'input--error'}
                            type="password"
                            placeholder="New password"
                            {...register('password', { 
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters long'
                                }, 
                                maxLength: {
                                    value: 20,
                                    message: 'Password can\'t be longer than 20 characters'
                                },
                            })}
                        />
                        {errors.password && <p className="error-msg">{errors.password.message}</p>}

                        <label>Avatar image (url)</label>
                        <input type="url" defaultValue={user.image} placeholder="Avatar image" {...register('image')}/>
                    </div>
                    {success && <p className="success-msg">Saved</p>} 
                    <button type="submit">Save</button>  
                </form>
            </Card>
        </React.Fragment>
    )
}

const mapStateToProps = (state: { app: { currentUser: user; serverErrors: false | {}; isLoggedIn: boolean; }; }) => ({
    user: state.app.currentUser,
    serverErrors: state.app.serverErrors,
    isLoggedIn: state.app.isLoggedIn

})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    const bound = bindActionCreators({updateUserData, clearServerErrors}, dispatch)
    return {
        updateProfile: bound.updateUserData,
        clearServerErrors: bound.clearServerErrors,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)