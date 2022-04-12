const {create} = require("ipfs-http-client");

const polkadot = require("@polkadot/api");
const crustio = require("@crustio/type-definitions");
const { waitReady } = require("@polkadot/wasm-crypto");
const { Keyring } = require("@polkadot/api");

const crustChainEndpoint = "wss://rpc.crust.network";
const Wsprovider = new polkadot.WsProvider(crustChainEndpoint);

const express = require('express')
const app = express();
const mysql= require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const db=mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"petscape",
    port:3307,
})

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))


async function ipfsClient()
{
    const ipfs = await create();
    return ipfs;
}

const obj={
  name : "sudarsun",
  email : "sudarsun@gmail.com",
  gender : "Female",
  phone : "9600771852",
  DOB : "25-09-2002",
  addressL1 : "No 5 jj nagar",
  addressL2 : "pondicherry",
  city : "Chennai",
  pincode : 605010,
  age : 19,
  pgonAdd : "0xC9E6ACd323C2Ae48bDAa3ff4570b2eD8e218433D"
 }

 const myJSON = JSON.stringify(obj);

async function saveText(){
    let ipfs = await ipfsClient();
    let result = await ipfs.add(myJSON);

    const sqlInsert="INSERT INTO cid (cid_path) VALUES (?);"
    db.query(sqlInsert,[result.path],(err, result) => {
            console.log(err);
        });
}
saveText();

let resu;

async function placeStorageOrder() {
  await waitReady();
  const api = new polkadot.ApiPromise({
    provider: Wsprovider,
    typesBundle: crustio.typesBundleForPolkadot,
  });
  await api.isReady;
  const fileCid = resu; 
  const fileSize = 2 * 1024 * 1024;
  const tips = 0;
  const memo = "";
  const tx = api.tx.market.placeStorageOrder(fileCid, fileSize, tips, memo);

  const keyring = new Keyring({ type: "sr25519" });
  console.log(keyring);
  const krp = keyring.addFromUri(
    "find curious smooth cart tumble jaguar impact grunt bird idle stand okay"
  );
  console.log(krp);

  await api.isReadyOrError;
  return new Promise((resolve, reject) => {
    tx.signAndSend(krp, ({ events = [], status }) => {
      console.log(`💸  Tx status: ${status.type}, nonce: ${tx.nonce}`);

      if (status.isInBlock) {
        events.forEach(({ event: { method, section } }) => {
          if (method === "ExtrinsicSuccess") {
            console.log(`✅  Place storage order success!`);
            resolve(true);
          }
        });
      } else {
      }
    }).catch((e) => {
      reject(e);
    });
  });
}

const res= placeStorageOrder();


async function getData(hash){
  let ipfs =  await ipfsClient();
  let asyncitr = ipfs.cat(hash);
  for await (const itr of asyncitr) {
      
    let data = Buffer.from(itr).toString();
    console.log(data);
  }
}

//const sqlgetId="SELECT cid_path from cid";
//db.query(sqlgetId,(err, result) => {
 //      getData(result[0].cid_path);
   // });
