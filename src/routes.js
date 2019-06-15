import {createStackNavigator, createAppContainer} from 'react-navigation';

import Principal from './pages/principal';
import SignInTelefone from './pages/signInTelefone';
import SignInEmail from './pages/signInEmail';
import SignUpEmail from './pages/signUpEmail';
import Perfil from './pages/perfil';

const Routes =  createStackNavigator({   
    
    SignInTelefone:{
        screen: SignInTelefone,        
    },

    SignInEmail:{
        screen: SignInEmail,
    },

    SignUpEmail: {
        screen: SignUpEmail, 
    },

    Principal: {
        screen: Principal,    
    },

    Perfil: {
        screen: Perfil,
    },
},
{
    initialRouteName: 'Principal',
    navigationOptions: {
        headerStyle: {
            backgroundColor: "#4169E1"
        },
        headerTintColor: "#FFF",    
    },
},
);

const App = createAppContainer(Routes);

export default App;