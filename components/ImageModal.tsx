import { View, Text, Modal , StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Colors from "@/constants/Colors";


type ImageModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
}
const ImageModal = ({modalVisible, setModalVisible, onCameraPress, onGalleryPress}:ImageModalProps) => {
  return <Modal visible={modalVisible} animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={{fontSize: 20, fontWeight: 'bold', fontFamily:'RobotoBold'}}>Add an image</Text>
        <TouchableOpacity style={styles.backButton} onPress={()=>setModalVisible(false)}>
          <Text style={styles.textOptions}><Feather name="x" size={24} color="black" /></Text>
     
        </TouchableOpacity>
        <View style={{
          flexDirection:'row',
          gap: 50,

        }}>
            <TouchableOpacity style={styles.optionContainer} onPress={onCameraPress}>
              <Text> <MaterialIcons name="photo-camera" size={24} color={Colors.primary} /></Text>
              <Text style={styles.textOptions}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer} onPress={onGalleryPress}>
              <Text><FontAwesome name="photo" size={24} color={Colors.primary} /></Text>
              <Text style={styles.textOptions}>Gallery</Text>
            </TouchableOpacity>
          </View>
      </View>
    </View>

  </Modal>;
};
const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContainer: {
		width: "80%",
		padding: 20,
		backgroundColor: "white",
		borderRadius: 10,
		alignItems: "center",
        position: 'relative'
	},
	optionContainer: {
        marginTop: 20,
		padding: 10,
		backgroundColor: "#f5f5f5",
		borderRadius: 10,
		alignItems: "center",
        gap: 5,
	},
    backButton:{
        position: 'absolute',
        top: 2,
        right: 2,
        
    }, 
    textOptions:{
        fontFamily: 'OpenSans',
        fontSize: 10
    }
});


export default ImageModal;
