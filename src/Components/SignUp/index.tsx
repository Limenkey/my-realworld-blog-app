import { Card } from "antd"
import { Link, Redirect } from "react-router-dom"
import { useForm } from "react-hook-form";
import './signup.scss'
import { clearServerErrors, signUp } from "../App/appSlice";
import React, { useState } from "react";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { user } from "../../TypeScrtipt/types";




const SignUp = ({ userLoading, userError, regNewUser, serverErrors, clearServerErrors }:any) => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [success, setSuccess] = useState(false)
    const isMatching = (value:string) => value === getValues('password')
    const onSubmit = async (data:user) => {
        clearServerErrors()
        await regNewUser({'user': data})
        if (!userLoading && !userError) setSuccess(true)
    };
    return (
        <React.Fragment>
            {success && !serverErrors && <Redirect to="/sign-in"/>}
            <Card className="form sign-up"> 
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1>Create new account</h1>
                    <div className="inputs">
                        <label>Username</label>
                        <input
                            className={errors.username && 'input--error'} 
                            type="text" 
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
                            onChange={() => serverErrors && clearServerErrors()}  
                        />
                        {errors.username && <p className="error-msg">{errors.username.message}</p>}
                        {serverErrors.username && <p className="error-msg">{`This username ${serverErrors.username}`}</p>}
                        <label>Email address</label>
                        <input 
                            className={errors.email && 'input--error'} 
                            type="email" 
                            placeholder="Email adress" 
                            {...register('email', {required: 'Email is required'})}
                            onChange={() => serverErrors && clearServerErrors()}
                        />
                        {errors.email && <p className="error-msg">{errors.email.message}</p>}
                        {serverErrors.email && <p className="error-msg">{`This email ${serverErrors.email}`}</p>}
                        <label>Password</label>
                        <input 
                            className={errors.password && 'input--error'} 
                            type="password" 
                            placeholder="Password" 
                            {...register('password', {
                                required: 'Password is required', 
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

                        <label>Repeat Password</label>
                        <input
                            className={errors.repeatPassword && 'input--error'}  
                            type="password" 
                            placeholder="Repeat Password" 
                            {...register('repeatPassword', {
                                required: 'This field is required',
                                validate: isMatching
                            })}
                        />
                        {errors.repeatPassword && <p className="error-msg">Passwords must match</p>}
                    </div> 
                    <div className="checkbox">
                        <input 
                            type="checkbox" 
                            defaultChecked 
                            {...register('personalData', {required: 'This box must be checked'})}
                        />
                        <span className="checkbox__personal-data">I agree to the processing of my personal information</span>
                    </div>
                    {errors.personalData && <p className="error-msg">{errors.personalData.message}</p>}
                    <button type="submit">Create</button>
                    <span className="account-link">Already have an account? <Link to="/sign-in">Sign in.</Link></span>   
                </form>
            </Card>
        </React.Fragment>
        
    )
}

const mapStateToProps = (state: { app: { currentUser: user; serverErrors: false | {}; }; }) => ({
    userLoading: state.app.currentUser.loading,
    userError: state.app.currentUser.error,
    serverErrors: state.app.serverErrors
})
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    const bound = bindActionCreators({signUp, clearServerErrors}, dispatch)
    return {
        regNewUser: bound.signUp,
        clearServerErrors: bound.clearServerErrors,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SignUp)