import { Card } from "antd"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form";
import './signin.scss'
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { clearServerErrors, fetchLoginUser } from "../App/appSlice";
import { connect } from "react-redux";
import React from "react";
import { Redirect } from "react-router";
import { user } from "../../TypeScrtipt/types";

const SignIn = ({fetchLoginUser, isLoggedIn, serverErrors, clearServerErrors}:any) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data:user) => {
        clearServerErrors()
        await fetchLoginUser({'user': data})
    };

    return (
        <React.Fragment>
            {isLoggedIn && !serverErrors && <Redirect to='/'/>}
            <Card className="form sign-in">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1>Sign In</h1>
                    <div className="inputs">
                        <label>Email address</label>
                        <input
                            className={(errors.email || serverErrors) ? 'input--error' : ''} 
                            type="email" 
                            placeholder="Email adress"
                            {...register('email', {required: 'Email is required'})}
                            onChange={() => serverErrors && clearServerErrors()}
                            />
                        {errors.email && <p className="error-msg">{errors.email.message}</p>}
                        {serverErrors['email or password'] && <p className="error-msg">{`Email or password ${serverErrors['email or password']}`}</p>}
                        
                        <label>Password</label>
                        <input
                            className={(errors.email || serverErrors) ? 'input--error' : ''} 
                            type="password" 
                            placeholder="Password"
                            {...register('password', {
                                required: 'Password is required', 
                            })}
                            onChange={() => serverErrors && clearServerErrors()}
                        />
                        {errors.password && <p className="error-msg">{errors.password.message}</p>}
                    </div>
                    <button type="submit">Login</button>
                    <span className="account-link">Don't have an account? <Link to="/sign-up">Sign up.</Link></span> 
                </form>
            </Card>
        </React.Fragment>
    )
}


const mapStateToProps = (state: { app: { isLoggedIn: boolean; currentUser: user; serverErrors: false | {}; }; }) => ({
    isLoggedIn: state.app.isLoggedIn,
    userLoading: state.app.currentUser.loading,
    userError: state.app.currentUser.error,
    serverErrors: state.app.serverErrors
})
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    const bound = bindActionCreators({fetchLoginUser, clearServerErrors}, dispatch)
    return {
        fetchLoginUser: bound.fetchLoginUser,
        clearServerErrors: bound.clearServerErrors,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)