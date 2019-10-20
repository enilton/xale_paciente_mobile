import React, {Component} from 'react';
import {StyleSheet
    , TextInput
    , View
    , TouchableHighlight
    , TouchableOpacity
    , Image
    , Picker
    , Text } from 'react-native';
import firebase from 'react-native-firebase';
import { Icon } from 'react-native-elements';
import * as LanguageConstants from '../resources/languages/br';
import * as Views from '../resources/views';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as GlobalConstants from '../resources/globalConstants';
import RodapePrincipal, * as FooterPrincipal from '../componentes/rodape/rodape';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-picker';
import api from "../services/api";
import Moment from 'moment';

class Perfil extends Component {

    static navigationOptions = { header: null };

    constructor(props) {
        super(props);  
    };   

    state = {                  
        msg:'',          
        showAlertWihtoutProgress: false,      
        showAlert: false,
        usuarioFirebase : '',        
        emailVerified: true,
        cidadesImplementadas: [],  
        
            nome: '',
            dtNascimento: LanguageConstants.DEFAULT_DATE,
            fotoPerfil: '',
            cidade: '',              
            telefone:'',
    };      

    componentDidMount() {        
        this.carregarCidades();   
        firebase.auth().onAuthStateChanged(user => {  
            if(!user ) {
                this.props.navigation.navigate(Views.SIGN_IN_TELEFONE);
            } else {                  
                this.setState({ usuarioFirebase: user });
                if (!user.emailVerified) {                    
                    this.setState ({ emailVerified: false});
                }
            } 
        });
        Moment.locale('pt-BR');    

        /*RNFS.readFile('../resources/img/profile-icon.PNG', 'base64')
            .then(res => this.setState.fotoPerfil = res);
            */
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

    carregarCidades = async () => {        
            const response = await api.get(`/cidades`);
            this.setState({ cidadesImplementadas: response.data });       
    };

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
   
    _handleDatePicked = (date) => {
      this.setState({dtNascimento: '' + date});
      this._hideDateTimePicker();
    };

    _showImagePicker = () =>{
        ImagePicker.launchImageLibrary(
            {
                title: LanguageConstants.IMAGE_PICKER_TITLE,
                customButtons: [
                    /*{ name: 'fb', title: 'Choose Photo from Facebook' }
                */],
                storageOptions: {
                  skipBackup: true,
                  path: 'images',
                },
              }
            ,(response) => {
                if (response.error) {
                    this.setState({msg:"falha ao carregar imagem"});
                } else {                
                    this.setState({imgFlyer: response});
                }
            }
        );
    }
    
    renderEmailConfirmation = async () => {
        this.setState({ msg: LanguageConstants.CONFIRM_MAIL });
        this.showAlert(false);
    }

    validarForm = () => { 

        if (this.state.nome === ''){
            this.setState({msg: LanguageConstants.NAME_FORCED });
            this.showAlert(false);   
            return;        
        }

        if (this.state.dtNascimento === LanguageConstants.DEFAULT_DATE){
            this.setState({msg: LanguageConstants.BORN_FORCED });          
            this.showAlert(false);          
            return;        
        }

        if (this.state.cidade === 0) {
            this.setState({msg: LanguageConstants.CITY_FORCED });           
            this.showAlert(false);          
            return;   
        }    
       
        this.atualizarPerfilUsuario();    
    };

    atualizarPerfilUsuario = () => {   

        const { usuarioFirebase, nome, dtNascimento, fotoPerfil, cidade } = this.state;        
            
        const usuarioInfo = {
            idFirebase: usuarioFirebase.uid,
            nome: nome,
            dtNascimento: dtNascimento,
            fotoPerfil,    
            cidade: cidade,          
        };

        api.post('/usuarios', usuarioInfo).then((response) => {
            this.setState({ msg: LanguageConstants.UPDATE_PROFILE_SUCESS });           
        }).catch((error) => {
            console.error(error);
            this.setState({ msg: LanguageConstants.UPDATE_PROFILE_FAIL });
        });        
        
        this.showAlert(false);        
    
   };
    
    render() {
        const { showAlert, showAlertWihtoutProgress, msg, cidadesImplementadas } = this.state;           
     
        let cidades = cidadesImplementadas.map(cidade => {
            return <Picker.Item key={cidade._id} value={cidade._id} label={cidade.nome} />
        });    
        
        return (
            <View style={styles.container}>            
                <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>   

                    <Text style={styles.textoSuperior}>
                        Perfil
                    </Text>
                    
                    {/*this.state.fotoPerfil && 
                        <TouchableHighlight onPress={this._showImagePicker}>
                            <Image style={styles.uploadAvatar} 
                                source={this.state.fotoPerfil}
                            />      
                        </TouchableHighlight>      
                    */}     

                    {!this.state.fotoPerfil &&
                        <TouchableHighlight onPress={this._showImagePicker}
                            style={styles.avatar}>
                            <Icon 
                                name='face'
                                type='material'
                                color='#da552f'
                            /> 
                        </TouchableHighlight>  
                    } 

                    {this.state.usuarioFirebase.emailVerified &&
                        <TextInput
                            placeholder="e-mail"
                            autoCapitalize="none"                    
                            style={styles.input}
                            maxLength={200}                        
                            value={this.state.usuarioFirebase.email}
                            editable={false}  
                        />
                    }  

                    {!this.state.usuarioFirebase.emailVerified &&
                        <TextInput
                            placeholder="e-mail"
                            autoCapitalize="none"                    
                            style={styles.inputEmailNaoVerificado}
                            maxLength={200}
                            onChangeText={email => {}}
                            onPress={() => {
                                this.renderEmailConfirmation
                            }}
                            value={this.state.usuarioFirebase.email}
                            editable={false}  
                        />
                    }                  

                    <TextInput
                            placeholder="telefone"
                            autoCapitalize="none"                    
                            style={styles.input}
                            maxLength={200}                           
                            value={this.state.usuarioFirebase.phoneNumber}
                            editable={false}/>
                    
                    <TextInput
                            placeholder="nome"
                            autoCapitalize="none"                    
                            style={styles.input}
                            maxLength={200}
                            onChangeText={nome => this.setState({ nome })}
                            value={this.state.nome}/>

                    <TextInput
                        placeholder="data de nascimento"
                        autoCapitalize="none"                    
                        style={styles.input}
                        maxLength={200}
                        onChangeText={nome => this.setState({ dtNascimento: Moment(dtNascimento).format('DD/MM/YYYY')})}
                        value={Moment(this.state.dtNascimento).format('DD/MM/YYYY')}                           
                        onFocus={this._showDateTimePicker} 
                        onPress={this._showDateTimePicker}/>                
                    
                    <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            mode="date"
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                    />
                    
                    <Picker
                        selectedValue={this.state.cidade}
                        style={styles.input}
                        onValueChange={ (itemValue, itemIndex) => ( this.setState({ cidade: itemValue }) ) } >
                        <Picker.Item key={0} value={0} label={'cidade'} />
                            {cidades}
                    </Picker>

                    <TouchableOpacity style={styles.button}
                        onPress={this.validarForm}>
                        <Icon 
                            name='sc-telegram'
                            type='evilicon'
                            color='#4169E1'
                        /> 
                    </TouchableOpacity>
                   
                </ScrollView>
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
               <RodapePrincipal navigation={this.props.navigation}/>
            </View>
        );                            
    }
};

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
        borderColor: "#4169E1",
        borderWidth:1,        
        paddingHorizontal:20,
        marginLeft:25,
        marginRight:25,
        borderRadius:5,
        marginBottom:10
    }, 
    
    inputEmailNaoVerificado: {
        height:45,
        width: 280,
        backgroundColor: "#fafafa",
        alignSelf: "stretch",
        borderColor: "#da552f",
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
        borderColor: "#4169E1",
        borderRadius: 5,
        borderWidth: 1,               
        justifyContent: 'center'        
    },

    linkButton: {
        height: 45, 
        width: 280,       
        backgroundColor: "transparent",
        alignSelf: "center",
        borderColor: "#4169E1",        
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
    },

    footer: {
        color: "#da552f"
    },

    footerTab: {
        color: "#4169E1"
    },
    
    avatar: {
        alignSelf: "center",
        height:140,
        width: 140,
        borderColor: "#fafafa",
        backgroundColor: "#fafafa",
        borderRadius: 5,
        borderWidth: 1,
        justifyContent: 'center',
        paddingHorizontal:20,
        marginLeft:25,
        marginRight:25,
        borderRadius:5,
        marginBottom:10
    }
});


export default Perfil;

