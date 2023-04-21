import db from '../db.js'

import bcrypt from 'bcryptjs'

import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword

    } from "firebase/auth";


  import { getAuth } from "firebase/auth";

  const auth = getAuth();

import { addDoc, collection ,doc, updateDoc,query, where,getDocs} from "firebase/firestore";

export const patientRegister = async(req,res) =>{

    try{

        await createUserWithEmailAndPassword(
            auth,
            req.body.email,
            req.body.password
            );

        sendEmailVerification(auth.currentUser).then(async() => {

        const patientDetails = req.body;
    
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    
        req.body.password = hashedPassword
    
        const addedPatientRef =  await addDoc(collection(db, "Patients"), patientDetails);
    
        await updateDoc( doc(db, "Patients", addedPatientRef.id), {
            patientId:addedPatientRef.id
            });
    
    
        if(addedPatientRef)
            {
                res.send({
                    status: "SuccessfullyAdded",
                    msg:"Please verify the email before log in",
                    Id:addedPatientRef.id
                    });
            }

        else
        res.status(400).send({ status: "fail", des: "resubmit the details" });
    
        })
        .catch((error) => {
            res.status(400).send({ error :error,status: "fail", des: "Some error occured while sending verifying link to email or in connection to firestore" });
                });  
        }

        catch(error){
        res.status(400).send({msg:error});
        }
};



export const patientLogin = async(req,res)=>{

    try{
        const loggedPatient = await signInWithEmailAndPassword(
            auth,
            req.body.email,
            req.body.password
          );
          
        if(loggedPatient.user.emailVerified){

            const patientQuery = await getDocs(query(collection(db, "Patients"), where("email", "==", req.body.email)));
    
                if( patientQuery.docs.length != 0 )
                {
                    patientQuery.forEach((patientDoc) => {

                    bcrypt.compare(req.body.password, patientDoc.data().password).then((isMatching) => {
                        
                        if(isMatching)
                        {
                            res.send({ Id: patientDoc.data().patientId})
                        }
                    });
               
                    })
                }
          }

          else{
            res.status(404).send({ msg: 'Please verify the email before logging in' });
          }

        }
    
    catch (error) {
            
            if(error.code === 'auth/user-not-found')
                res.status(400).send({msg : 'The email is not registered'});
            
            else if(error.code === 'auth/wrong-password')
                res.status(400).send({msg : 'The password is wrong'});
            
            else
            res.status(400).send({msg:error});

          }
};