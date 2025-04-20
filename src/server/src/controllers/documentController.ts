import { Document } from "../models/documentModel";
import { saveLocally, sendToNearbyServer } from '../utils/localstorage';

const defaultData = "";

export const findOrCreateDocument = async({ documentId, documentName }: { documentId: string, documentName: string }) => {
    if(!documentId){
        return ;
    }   
    const document = await Document.findById(documentId) ;
    if(document){
        return document ;
    }

    const newDocument = await Document.create({ _id: documentId, name: documentName , data: defaultData }) ;
    const docData = {
        title: documentName,
        content: defaultData,
        updatedAt: new Date()
    };

    saveLocally(documentId,docData);
    return newDocument ;
}

export const updateDocument = async(id: string, data: Object) => {
    if (!id) return;

    await Document.findByIdAndUpdate(id, data);

    const doc = await Document.findById(id); // Fetch updated doc

    if (doc) {
        const docData = {
            title: doc.name,
            content: doc.data,
            updatedAt: new Date()
        };

        saveLocally(id,docData);
    }
}