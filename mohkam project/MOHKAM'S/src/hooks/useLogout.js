import React from 'react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atom/userAtom'
import Toast from './useShowToast'

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom)
    const [error, setError] = useState(null); // State to hold error message

    const logout= async()=>{
        try {
            const res = await fetch("/api/users/logout",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                }
            })
            const data = await res.json()
            console.log(data);
            if (!res.ok) {
                // Check if the response indicates an error
                throw new Error(data.error || "Failed to logout"); // Throw an error with the error message
              }
 
            localStorage.removeItem("user-mohkam")
            setUser(null)
        } catch (error) {
            
        }
    }
    return (<>
    {error && <Toast message={error} type="error" />}
    </>
) && logout
}

export default useLogout