import db from '../db.js';

import bcrypt from 'bcryptjs'

import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
  } from "firebase/auth";


 import { getAuth } from "firebase/auth";

 const auth = getAuth();

import { addDoc, collection ,doc, updateDoc,query, where,getDocs} from "firebase/firestore";

export const doctorRegister = async(req,res) =>{

try{

    await createUserWithEmailAndPassword(
        auth,
        req.body.email,
        req.body.password
      );

    sendEmailVerification(auth.currentUser).then(async() => {

    const doctorDetails = req.body;

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    
    req.body.password = hashedPassword

    const addedDoctorRef = await addDoc(collection(db, "Doctors"), doctorDetails);

    await updateDoc( doc(db, "Doctors", addedDoctorRef.id), {
        doctorId:addedDoctorRef.id
        });

    if(addedDoctorRef)
    {
        res.send({
            status: "SuccessfullyAdded",
            msg:"Please verify the email before log in",
            Id:addedDoctorRef.id
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



export const doctorLogin = async(req,res)=>{

    try{
        const loggedDoctor = await signInWithEmailAndPassword(
            auth,
            req.body.email,
            req.body.password
          );
          
        if(loggedDoctor.user.emailVerified){

            const doctorQuery = await getDocs(query(collection(db, "Doctors"), where("email", "==", req.body.email)));
    
                if( doctorQuery.docs.length != 0 )
                {
                    doctorQuery.forEach((doctorDoc) => {

                    bcrypt.compare(req.body.password, doctorDoc.data().password).then((isMatching) => {
                        
                        if(isMatching)
                        {
                            res.send({ Id: doctorDoc.data().doctorId})
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