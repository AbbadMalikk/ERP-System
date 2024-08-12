import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atom/authAtom';
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atom/userAtom';
  
  export default function LoginCard() {
    const [showPassword, setShowPassword] = useState(false);
    const showToast =useShowToast()
    const setAuthScreen = useSetRecoilState(authScreenAtom)
    const [inputs,setinputs]=useState({
        email:"",
        password:"",
    });
    const setUser = useSetRecoilState(userAtom)
    const [loading,setLoading]=useState(false)
    const handleLogin =async ()=>{
      setLoading(true)
        try {
         const res = await fetch("/api/users/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(inputs),
         })
         const data = await res.json();
         if(data.error){
            showToast("Error",data.error,"error")
             return
         }
         console.log(data)
         localStorage.setItem("user-mohkam",JSON.stringify(data))
         setUser(data)
          
        } catch (error) {
            showToast("Error",error.message,"error")
        }finally{
          setLoading(false)
        }
    }

    return (
      <Flex
        align={'center'}
        justify={'center'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Login
            </Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.dark')} 
            boxShadow={'lg'}
            p={8} w={{base:"full",sm:"400px"}}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>email</FormLabel>
                <Input type="text" 
                 onChange={(e)=>setinputs({...inputs, email: e.target.value })}
                 value={inputs.email}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} 
                   onChange={(e)=>setinputs({...inputs, password : e.target.value })}
                   value={inputs.password}
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Logging In"
                  size="lg"
                  onClick={handleLogin} isLoading={loading}>
                  Login
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Don&apos;t have an account? <Link color={'blue.400'}
                  onClick={()=>{
                    setAuthScreen("signup")
                  }}
                  >Signup</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }