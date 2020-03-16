import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import Reference = admin.database.Reference;

admin.initializeApp();


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

async function writeToken(value: any) {

    console.log(value);
    await admin.database().ref('/gate_token').set({token: value});
}

async function readToken() {
    return await getOnce(admin.database().ref('/gate_token'))
}

export const notify = functions.https.onCall((data, context) => {

    let v : any;
    readToken().then(value => {
        v = value;
        // let token = store.get("fcm.grip.token");
        console.log(v.token);
        const message = {
            data: {
                command: 'OPEEEEEENNN !!! Mouahahahahahahah'
            },
            token: v.token
        };

        //const original = req.query.text;

// Send a message to the device corresponding to the provided
// registration token.
        admin.messaging().send(message)
            .then((r) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', r);
                return {data: {error: false}};

            })
            .catch((error) => {
                console.log('Error sending message:', error);
                return {data: {error: true, message: error.toString()}};

            });
    }).catch((e) => {
        console.log('Error message:', e);
        return e;

    })
});

export const register = functions.https.onRequest((request, response) => {
    writeToken(request.body.data.token).then(() => {
        response.send({data: {error: false}})
    }).catch((e) => {
        console.log('Error message:', e);
        response.send({data: {error: true, message: e.toString()}});
    })
});

export const ack = functions.https.onRequest((request, response) => {
    response.send({data: {ack: true}})
});

function getOnce(ref: Reference) {
    return new Promise((resolve, reject) => {
        ref.once("value", snap => {
            resolve(snap.val())
        }).catch(e => reject(e))
    })
}
