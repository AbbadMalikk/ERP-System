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
    useToast
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import { useSetRecoilState } from 'recoil';
  import authScreenAtom from '../atom/authAtom';
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atom/userAtom';
  
  export default function SignupCard() {
    const [showPassword, setShowPassword] = useState(false);
    const setAuthScreen = useSetRecoilState(authScreenAtom)
    const [inputs,setinputs]=useState({
        username:"",
        email:"",
        password:"",
    });
    const showToast = useShowToast() 
    const [loading,setLoading]=useState(false)
    const setUser = useSetRecoilState(userAtom)

    const handleSignup = async ()=>{
      setLoading(true)
        try {
            const res = await fetch("/api/users/signup",{
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
            localStorage.setItem("user-mohkam",JSON.stringify(data))
            setUser(data)
        } catch (error) {
            showToast("Error",error,"error")
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
              Sign up
            </Heading>
            <Text fontSize={'lg'}>
              Welcome to Threads
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input type="text"
                    onChange={(e)=>setinputs({...inputs, username: e.target.value })}
                    value={inputs.username}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" 
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
                  loadingText="Signing Up"
                  size="lg"
                  onClick={handleSignup} isLoading={loading}>
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user? <Link color={'blue.400'}
                   onClick={()=>{
                    setAuthScreen("login")
                  }}
                  >Login</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }