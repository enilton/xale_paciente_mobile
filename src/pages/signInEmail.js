import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import firebase from 'react-native-firebase';
import { Icon } from 'react-native-elements';
import * as LanguageConstants from '../resources/languages/br';
import * as Views from '../resources/views';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Validators from '../utils/validadores';
import * as GlobalConstants from '../resources/globalConstants';

class SignInEmail extends Component {

    static navigationOptions = { header: null };

    constructor(props) {
        super(props);  
    };   

    state = {        
        msg:'',           
        email:'eniltjr1@gmail.com',
        senha:'123456',  
        showAlert: false,  
        showAlertWihtoutProgress: false,   
        usuario: '',  
    };     

    componentDidMount() {          
        firebase.auth().onAuthStateChanged(user => {            
            if(user){                       
                if (!user.emailVerified) {
                    this.setState({ msg: LanguageConstants.CONFIRM_MAIL});
                    this.showAlert(false);
                }
            } else {
                this.props.navigation.navigate(Views.SIGN_IN_EMAIL);
            }
        });      
    };

    configureMsg = (msg) => {
        if (msg.includes(GlobalConstants.FIREBASE_ERROR_USER_NOT_EXISTS)) {                           
            this.setState({ msg: LanguageConstants.SIGN_IN_WITH_EMAIL_USER_NOT_FOUND });
        }
    }

    loginWithEmail = async () => {            
        this.setState({ msg: LanguageConstants.PLEASE_WAIT });
        this.showAlert(true);
        const { email, senha } = this.state
        firebase.auth()
            .signInWithEmailAndPassword(email, senha)
            .then(() => { 
                const usuario = firebase.auth().currentUser;
                if (usuario){
                    if (!usuario.emailVerified){
                        this.setState({ msg: LanguageConstants.CONFIRM_MAIL })
                        this.showAlert(false);
                    } else {
                        this.props.navigation.navigate(Views.MAIN);
                    }
                }
            })
            .catch(error => {
                    console.log(error);
                    this.configureMsg(error.message)
                    this.showAlert(false);        
                }                
            );
    };

  
    showAlert = (show_progress_icon) => {
        if (show_progress_icon) {
            this.setState({ showAlert: true });
        } else {
            this.setState({ showAlertWihtoutProgress: true });
        }
    };  

    hideAlerts = async () => {               
        this.setState({ showAlert: false });
        this.setState({ showAlertWihtoutProgress: false });       
    };

    validarForm = async () => {
        const { email, senha } = this.state;
        let isValid = true;

        if (!senha.length) {
            this.setState({ msg: LanguageConstants.INSERT_VALID_PWD });
            this.showAlert(false);   
            isValid = false;           
        }
    
        if (email.length === 0) {
            this.setState({ msg: LanguageConstants.INSERT_VALID_MAIL });
            this.showAlert(false);   
            isValid = false; 
        }

        if (!Validators.validarEmail(email)){
            this.setState({ msg: LanguageConstants.INSERT_VALID_MAIL });
            this.showAlert(false);   
            isValid = false; 
        }

        if (isValid){
            this.loginWithEmail();
        }
    }
      

    render() {
        const { email, senha, showAlert, showAlertWihtoutProgress, msg } = this.state;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scroll} 
                    showsVerticalScrollIndicator={false}>    

                    <Image style={{ width: 180, height: 200, marginBottom: 20, alignSelf: 'center', marginTop:20 }} 
                                source={require('../images/xale_sombreado.png')}/>
                    
                    <View>               

                        <Text style={styles.textoSuperior}>
                                {LanguageConstants.ITS_OK_TEXT}
                        </Text>  

                        <Text style={styles.textoInferior}>
                                {LanguageConstants.HOW_THIS_MAIL_TEXT}
                        </Text>     

                        <TextInput
                            placeholder={LanguageConstants.PLACEHOLDER_EMAIL}
                            autoCapitalize="none"
                            style={styles.input}                   
                            value={email}
                            onChangeText={email => this.setState({email})}/>

                        <TextInput
                            style={styles.input}
                            placeholder={LanguageConstants.PLACEHOLDER_PASSWORD}                   T
                            secureTextEntry
                            value={senha}
                            onChangeText={senha => this.setState({senha})}/>

                        <TouchableOpacity style={styles.button}
                            onPress={this.validarForm}>
                            <Icon 
                                    name='sc-telegram'
                                    type='evilicon'
                                    color='#4169E1'
                                />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkButton}
                            onPress={() => this.props.navigation.navigate(Views.SIGN_UP_EMAIL)}>
                            <Text style={styles.linkButtonText}>{LanguageConstants.ACCOUNT_CREATE}</Text>
                        </TouchableOpacity>      

                        <TouchableOpacity style={styles.linkButton}
                            onPress={() => this.props.navigation.navigate(Views.SIGN_IN_TELEFONE)}>
                            <Text style={styles.linkButtonText}>{LanguageConstants.BACKWARD}</Text>
                        </TouchableOpacity>   

                        <AwesomeAlert
                            show={showAlert}
                            showProgress={true}
                            title="Xale"
                            message={msg}
                            closeOnTouchOutside={true}
                            closeOnHardwareBackPress={false}
                            showCancelButton={false}
                            showConfirmButton={false}                                                     
                        />     

                        <AwesomeAlert
                            show={showAlertWihtoutProgress}
                            showProgress={false}
                            title="Xale"
                            message={msg}
                            closeOnTouchOutside={true}
                            closeOnHardwareBackPress={false}
                            showCancelButton={false}
                            showConfirmButton={false}  
                            onDismiss={() => this.hideAlerts()}                                                 
                        />     
                    </View> 
                </ScrollView>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    scroll: {
        flex: 5,
        backgroundColor: "#4169E1"
    },

    container: {
        flex: 1,
        backgroundColor: "#4169E1",
        justifyContent: "center",
        alignItems: "center"
    },

    input:{
        height:45,
        width: 280,
        backgroundColor: "#fafafa",
        alignSelf: "stretch",
        borderColor: "#0000FF",
        borderWidth:1,        
        paddingHorizontal:20,
        marginLeft:25,
        marginRight:25,
        borderRadius:5,
        marginBottom:10
    },    

    button: {
        height: 45, 
        width: 280,       
        backgroundColor: "#87CEEB",
        alignSelf: "center",
        borderColor: "#0000FF",
        borderRadius: 5,
        borderWidth: 1,               
        justifyContent: 'center'
    },

    linkButton: {
        height:45, 
        width: 280,       
        backgroundColor: "transparent",
        alignSelf: "center",
        borderColor: "#0000FF",        
        borderWidth: 0,               
        justifyContent: 'center'
    },

    linkButtonText:{
        fontSize: 12,
        color: "#fafafa",
        textDecorationLine: 'underline'          
    },   
   
    textoSuperior : {
        fontSize:32,
        color: "#fafafa",
        marginLeft: 30        
    },

    textoInferior : {
        fontSize: 16,
        color: "#fafafa",
        marginBottom: 20,
        marginLeft: 30 
              
    }
});

export default SignInEmail;