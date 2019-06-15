import React, {Component} from 'react';
import { StyleSheet } from 'react-native';

export class MenuLateral extends Component {    
    render () {
        return (
            <div>   
                 <View style={ styles.container }>
                        <Text>
                            <Icon name="rocket" size={30} color="#900" />                            
                        </Text>
                </View>
            </div>
        )
    };
};

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }
});
