import React, {Component} from 'react';
import {StyleSheet, TextInput, View, TouchableHighlight, TouchableOpacity, Image, Picker, Text } from 'react-native';
import firebase from 'react-native-firebase';
import { Icon } from 'react-native-elements';
import * as LanguageConstants from '../resources/languages/br';
import * as Views from '../resources/views';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as GlobalConstants from '../resources/globalConstants';
import MainFooter from '../componentes/footer/footer';
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
        
            nome: 'TESTE_NOME',
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

        RNFS.readFile('../resources/img/profile-icon.PNG', 'base64')
            .then(res => this.setState.fotoPerfil = res);
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
        ImagePicker.launchImageLibrary(this.options, (response) => {
            if (response.error) {
                this.setState({msg:"falha ao carregar imagem"});
            } else {                
                this.setState({imgFlyer: response});
            }
        });
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
            fotoPerfil: '',    
            cidade: cidade,          
        };

        console.log(usuarioInfo);

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
                    {this.state.fotoPerfil && 
                        <TouchableHighlight onPress={this._showImagePicker}>                                      
                            <Image style={styles.uploadAvatar} source={this.state.fotoPerfil}/>         
                        </TouchableHighlight>
                    }

                    {!this.state.fotoPerfil &&
                        <TouchableHighlight onPress={this._showImagePicker}>                                      
                            <Icon  style={styles.uploadAvatar} 
                                  name='face'
                                  type='material'
                                  color='#da552f'
                            />                        
                        </TouchableHighlight>
                    }

                    <TextInput
                            placeholder="e-mail"
                            autoCapitalize="none"                    
                            style={styles.input}
                            maxLength={200}
                            onChangeText={email => {}}
                            value={this.state.usuarioFirebase.email}
                            editable={false}/>


                    <TouchableHighlight onPress={this.renderEmailConfirmation} isVisible={!this.state.usuarioFirebase.emailVerified}>
                        <Image
                            style={styles.alertEmailNaoVerificado}
                            source={this.state.fotoPerfil}
                        />                    
                    </TouchableHighlight>

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
                            onFocus={this._showDateTimePicker} />
                    
                    <TouchableOpacity style={styles.buttonData}
                        onPress={this._showDateTimePicker}>
                        <Icon
                            name='calendar'
                            type='evilicon'
                            color='#517fa4'
                        />
                    </TouchableOpacity>

                    <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            mode="date"
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                    />
                  
                    <Picker
                        selectedValue={this.state.cidade}
                        onValueChange={ (itemValue, itemIndex) => ( this.setState({ cidade: itemValue }) ) } >
                        <Picker.Item key={0} value={0} label={'cidade'} />
                        {cidades}
                     </Picker>

                     <TouchableOpacity style={styles.button}
                        onPress={this.validarForm}>
                       <Text>Salvar</Text>
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
            <MainFooter />
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
    },

    footer: {
        color: "#da552f"
    },

    footerTab: {
        color: "#0000FF"
    },

    uploadAvatar: {
        height: 200,
        width:200,       
        backgroundColor: "transparent",
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: 5,
        marginBottom:10       
    },

    alertEmailNaoVerificado : {
        height: 10, 
        width: 10,       
        backgroundColor: "#87CEEB",
        alignSelf: "center",
        borderColor: "#0000FF",
        borderRadius: 5,
        borderWidth: 1,               
        justifyContent: 'center'
    }
});


export default Perfil;

