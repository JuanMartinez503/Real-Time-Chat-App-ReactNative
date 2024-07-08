import { View, Text, Modal , StyleSheet, TouchableOpacity} from "react-native";
import React from "react";


type ImageModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}
const ImageModal = ({modalVisible, setModalVisible}:ImageModalProps) => {
  return <Modal visible={modalVisible}>
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text>Image Modal</Text>
        <TouchableOpacity style={styles.backButton} onPress={()=>setModalVisible(false)}>
          <Text style={styles.textOptions}>Close</Text>
        </TouchableOpacity>
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
        top: 0,
        right: 0,
        
    }, 
    textOptions:{
        fontFamily: 'Arial',
        fontSize: 10
    }
});


export default ImageModal;
