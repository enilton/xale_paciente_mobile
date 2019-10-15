import React, {Component} from 'react';
import {StyleSheet, Text, View,  TouchableOpacity} from 'react-native';
import firebase from 'react-native-firebase';
import * as LanguageConstants from '../resources/languages/br';
import * as Views from '../resources/views';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as GlobalConstants from '../resources/globalConstants';
import RodapePrincipal from '../componentes/rodape/rodape';
import { Icon } from 'react-native-elements';


class Principal extends Component {

    static navigationOptions = { header: null };

    constructor(props) {
        super(props);  
    };

    state = {            
        email:'enil@gmail.com',
        senha:'123456',    
        msg:'',          
        showAlertWihtoutProgress: false,      
        showAlert: false,
        usuario : ''
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

        firebase.auth().onAuthStateChanged(user => {
            if (!user || !user.emailVerified){
                firebase.auth().signOut();
                this.props.navigation.goBack();
            }
        });
    };

    componentDidMount(){    

        firebase.auth().onAuthStateChanged(user => {  
            if(!user ) {
                this.props.navigation.navigate(Views.SIGN_IN_TELEFONE);
            } else {          
                if (!user.emailVerified) {  
                    user.sendEmailVerification();
                    this.setState ({ msg: LanguageConstants.FIREBASE_EMAIL_VALIDATION});
                    this.setState({ showAlertWihtoutProgress: true });
                }
            } 
        });
    }
    
    renderEmailConfirmation = async () => {
        this.setState({ msg: LanguageConstants.CONFIRM_MAIL });
        this.showAlert(false);
    }

    render() {
        const { showAlert, showAlertWihtoutProgress, msg } = this.state;          
        
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scroll} 
                            showsVerticalScrollIndicator={false}>                                
                </ScrollView>

                <RodapePrincipal navigation={this.props.navigation}/>
                
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
        );
    }
};

const styles = StyleSheet.create({
    scroll: {
        flex: 5,
        backgroundColor: "#fafafa"
    },

    container: {
        flex: 1,
        backgroundColor: "#fafafa",
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

export default Principal;

