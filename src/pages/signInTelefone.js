import React, {Component} from 'react';
import {StyleSheet, Text, View,TextInput, TouchableOpacity, Image} from 'react-native';
import firebase from 'react-native-firebase';
import PhoneInput from 'react-native-phone-input';
import { Icon } from 'react-native-elements';
import * as LanguageConstants from '../resources/languages/br';
import * as Views from '../resources/views';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import api from "../services/api";

class SignInTelefone extends Component {

    static navigationOptions = { header: null };

    constructor(props) {
        super(props);  
    }   

    state = {        
        msg:'',   
        usuario:'',      
        showAlert: false,   
        codigoConfirmacao:'',              
        confirmResult: null,              
        cca: LanguageConstants.DEFAULT_CCA,       
        showAlertWihtoutProgress: false,      
    };   
    
    componentDidMount() {       
        this.numeroTelefone.selectCountry(this.state.cca);
        firebase.auth().onAuthStateChanged(user => {  
            if (user) {
                this.props.navigation.navigate(Views.MAIN);
            } else {
                this.props.navigation.navigate(Views.SIGN_IN_TELEFONE);
            }
        });
    };   

    validateFormTelefone = () => {     
        if ((!this.numeroTelefone.getValue()) || (this.numeroTelefone.getValue().length <= 3)){
            this.setState({ msg: LanguageConstants.INSERT_VALID_TELEPHONE });
            this.showAlert(false);
        } else {
            this.loginWithTelephoneNumber();
        }
    }

    loginWithTelephoneNumber = async () => {        
        this.setState({ msg: LanguageConstants.SENDING_CODE });        
        this.showAlert(true);
        firebase.auth().signInWithPhoneNumber(this.numeroTelefone.getValue())
                .then(confirmResult => this.setState({ confirmResult, message: LanguageConstants.SENDED_CODE }))
                .catch((error) => {
                    console.log(error);
                    this.setState({ msg: LanguageConstants.AUTH_FAILED })
                });
    };   

    confirmCode = () => {
        const { codigoConfirmacao, confirmResult } = this.state;    
        if (confirmResult && codigoConfirmacao.length) {
          confirmResult.confirm(codigoConfirmacao)
            .then((user) => {
              this.setState({ msg: LanguageConstants.CODE_VALID });
              this.props.navigation.navigate(Views.MAIN);
            })
            .catch((error) => {
                console.log(error);
                this.setState({ msg: LanguageConstants.CODE_NOT_VALID })
            });
        }
    };

    showAlert = (progress) => {
        if (progress) {
            this.setState({ showAlert: true });
        } else {
            this.setState({ showAlertWihtoutProgress: true });
        }
    };      

    render() {
        const {  confirmResult, showAlert, showAlertWihtoutProgress, msg } = this.state;

        const usuario = firebase.auth().currentUser;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scroll} 
                    showsVerticalScrollIndicator={false}>                   

                        <Image style={{ width: 180, height: 200, marginBottom: 20, alignSelf: 'center', marginTop:20 }} 
                            source={require('../images/xale_sombreado.png')}/>
                        
                        {!usuario && !confirmResult && this.rendernumeroTelefoneInput()}                                      
                        
                        {!usuario && confirmResult && this.renderCodigoVerificacao()} 

                        <TouchableOpacity style={styles.linkButton}
                                onPress={() => this.props.navigation.navigate(Views.SIGN_IN_EMAIL)}>
                            <Text style={styles.linkButtonText}>{LanguageConstants.SIGN_IN_WITH_EMAIL}</Text>
                        </TouchableOpacity>   

                        <AwesomeAlert
                            show={showAlert}
                            showProgress={true}
                            title="Xale"
                            message={msg}
                            closeOnTouchOutside={true}
                            closeOnHardwareBackPress={true}
                            showCancelButton={false}
                            showConfirmButton={false}                               
                        />   

                        <AwesomeAlert
                            show={showAlertWihtoutProgress}
                            showProgress={false}
                            title="Xale"
                            message={msg}
                            closeOnTouchOutside={true}
                            closeOnHardwareBackPress={true}
                            showCancelButton={false}
                            showConfirmButton={false}                                                                            
                        />                                              
                </ScrollView>
            </View>
        );
    };  

    rendernumeroTelefoneInput() {
        return (
            <View style={styles.container}>              
                    <Text style={styles.textoSuperior}>
                        {LanguageConstants.WELCOME_TEXT}
                    </Text>  

                    <Text style={styles.textoInferior}>
                        {LanguageConstants.HOW_TO_START_TEXT}
                    </Text> 
              
                    <PhoneInput style={styles.input}  maxLength={14} offset={20}
                        autoFormat={true}
                         ref={(ref) => {                         
                            this.numeroTelefone = ref;                
                         }}                                                  
                    />

                    <TouchableOpacity style={styles.button}
                        onPress={this.validateFormTelefone}>
                        <Icon 
                            name='sc-telegram'
                            type='evilicon'
                            color='#4169E1'
                        />
                    </TouchableOpacity>                  
            </View>
        );
    };

    renderCodigoVerificacao() {
        const { codigoVerificacao } = this.state;      
        return (
            <View  style={styles.container}>              
                <Text style={styles.textoSuperior}>
                    {LanguageConstants.GOOD_TEXT}
                </Text>  

                <Text style={styles.textoInferior}>
                    {LanguageConstants.CODE_VERIFY_INPUT_TEXT}                        
                </Text>                

                <TextInput
                    autoFocus
                    style={styles.input}
                    onChangeText={value => this.setState({ codigoVerificacao: value })}
                    placeholder={' x x x x x x'}
                    value={codigoVerificacao}
                />

                <TouchableOpacity style={styles.button}
                            onPress={this.confirmCode}>
                    <Icon 
                        name='check'
                        type='evilicon'
                        color='#da552f'
                    />
                </TouchableOpacity>
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
        height: 45, 
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
        alignSelf: "center",
        textDecorationLine: 'underline'             
    },   
   
    textoSuperior : {
        fontSize:32,
        color: "#fafafa",
        marginLeft: 30,
        alignSelf:'flex-start'       
    },

    textoInferior : {
        fontSize: 16,
        color: "#fafafa",
        marginBottom: 20,
        marginLeft: 30, 
        alignSelf:'flex-start'              
    },
});

export default SignInTelefone;