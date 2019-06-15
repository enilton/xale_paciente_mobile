import React, {Component} from 'react';
import { Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { Footer, FooterTab, Button,  Badge } from 'native-base';
import * as Views from '../../resources/views'; 

export default class MainFooter extends Component { 

    constructor(props) {
        super(props);  
    };

    render() {
      return (
        <Footer>
            <FooterTab>
                <Button active badge vertical>
                    {/*<Badge><Text>Menu</Text></Badge>*/}
                    <Icon 
                            name='menu'
                            type='material'
                            color='#da552f'
                        />
                    <Text>Menu</Text>
                </Button>
                <Button vertical onPress={() => {this.props.navigation.navigate(Views.PROFILE)}}>
                    <Icon 
                            name='face'
                            type='material'
                            color='#da552f'
                        />
                    <Text>Perfil</Text>
                </Button>                
            </FooterTab>
        </Footer>    
       );
     }
  }