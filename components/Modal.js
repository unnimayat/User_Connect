import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState,useEffect } from "react"; 
import Bid from "./bid";
const Modal = ({ setVisible }) => {
    const [amount, setAmount] = useState(""); 
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [label, setLabel] = useState("");
    const [sub, setSub] = useState(false);
    //👇🏻 Function that closes the Modal component
    const closeModal = () => setVisible(false);
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);

    //👇🏻 Logs the group name to the console
    const handleCreateRoom = () => {
        console.log({ amount });
        setLabel(`Amount: $${amount}`); 
        setSub(true);
        closeModal();
    };
    return (
        <View style={styles.modalContainer}>
            <Text style={styles.modalsubheading}>Enter the Amount</Text>
            <TextInput
                style={styles.modalinput}
                placeholder='Amount...'
                onChangeText={(value) => setAmount(value)}
            />

            <View style={styles.modalbuttonContainer}>
                <Pressable style={styles.modalbutton} onPress={handleCreateRoom}>
                    <Text style={styles.modaltext}>CREATE</Text>
                </Pressable>
                <Pressable
                    style={[styles.modalbutton, { backgroundColor: "grey" }]}
                    onPress={closeModal}
                >
                    <Text style={styles.modaltext}>CANCEL</Text>
                </Pressable>
            </View>
            {sub ? <Bid setSub={setSub} /> : ""}
            {/* {label !== "" && (
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{label}</Text>
                    <Text style={styles.timerText}>
                        Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}
                    </Text>
                    <View style={styles.acceptRejectContainer}>
                        <Pressable style={styles.acceptButton} onPress={closeModal}>
                            <Text style={styles.modaltext}>ACCEPT</Text>
                        </Pressable>
                        <Pressable style={styles.rejectButton} onPress={closeModal}>
                            <Text style={styles.modaltext}>REJECT</Text>
                        </Pressable>
                    </View>
                </View>
            )} */}
        </View>
    );
};
const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalsubheading: {
        fontSize: 18,
        marginBottom: 10,
    },
    modalinput: {
        height: 40,
        width: 250,
        borderColor: "gray",
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    modalbuttonContainer: {
        flexDirection: "row",
    },
    modalbutton: {
        backgroundColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    modaltext: {
        color: "#FFF",
        fontSize: 16,
    },
    labelContainer: {
        marginTop: 20,
        alignItems: "center",
        borderRadius: 10,
        borderColor:'black',
        borderWidth:1,
        paddingVertical:10,
    },
    labelText: {
        fontSize: 18,
        marginBottom: 10,
    },
    timerText: {
        fontSize: 16,
        marginBottom: 10,
    },
    acceptRejectContainer: {
        flexDirection: "row",
    },
    acceptButton: {
        backgroundColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    rejectButton: {
        backgroundColor: "grey",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        borderRadius: 5,
    },
};
export default Modal;