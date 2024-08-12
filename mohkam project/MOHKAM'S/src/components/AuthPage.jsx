import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import authScreenAtom from '../atom/authAtom'
import Login from './Login'
import SignUp from './SignUp'
// import LoginCard from './LoginCard'
// import SignupCard from './SignupCard'
const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom)
    console.log(authScreenState)
  return (
    <>
      {authScreenState === "login" ? <Login/> : <SignUp/>}
    </>
  )
}

export default AuthPage
