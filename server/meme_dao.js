const db = require('./db');

//Soluzione 1(Soluzione 2 invece vuole la list delle single table per unirle poi in fase di API ad esempio, o anche nella logica interna del programma)
// Get all meme -> Meme is built from many table
// exports.listMeme = () => {
//     return new Promise((resolve, reject) => {
//         const sql = `SELECT m.id, m.title, mt.img, m.visibility, m.color, m.font, m.templateId, 
//             c.id as creatorId, c.username as creatorUsername, st.position, s.text 
//          FROM Meme m, MemeTemplate mt, Creators c, SentencesTemplate st, SentencesMeme s
//          WHERE m.templateId = mt.id AND m.creatorId = c.id AND mt.id = st.templateId AND st.id = s.sentencesTemplateId AND s.memeId = m.id`;
//         db.all(sql, (err, rows) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }

//             console.log(rows);
//             const meme = [];
//             for (i = 0; i < rows.length; i++) {
//                 key = rows[i].id;
//                 //Uso findIndex cosi cerco solo sino a che non l'ho trovato, se lo trovo uno non serve continuare
//                 //Inoltre mi permetterà di modificare l'elemento del vettore
//                 elementIndex = meme.findIndex((m) => m.id === key);
//                 if (elementIndex !== -1) {
//                     //Se find ritorna un elemento diverso da -1 significa che l'elemento è gia presente, per cui devo
//                     //solo aggiornare il vettore delle frasi
//                     meme[elementIndex] = {
//                         ...meme[elementIndex],
//                         sentences: [...meme[elementIndex].sentences, { text: rows[i].text, position: rows[i].position }]
//                         //Aggiungo le nuove frasi
//                     };

//                 } else {
//                     //Nuovo elemento da aggiungere
//                     meme.push({
//                         id: rows[i].id,                  //Il meme è unico, anche se avro tante righe quante sono le sentences di ogni template, 
//                         //prendiamo sempre il primo che deve esistere sempre
//                         title: rows[i].title,            //Stesso discorso
//                         img: rows[i].img,                //Stesso discorso
//                         visibility: rows[i].visibility,
//                         color: rows[i].color,
//                         font: rows[i].font,
//                         templateId: rows[i].templateId,
//                         creator: { id: rows[i].creatorId, username: rows[i].creatorUsername },
//                         sentences: [{ text: rows[i].text, position: rows[i].position }]             //Aggiungo la prima frase che ho trovato
//                     })
//                 }

//             }

//             resolve(meme);
//         });
//     });
// };

//Soluzione2 (listMemeTemplate,list Meme)
// Get all memeTemplate
exports.listMemeTemplate = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT mt.id, mt.nome, mt.img, st.position, st.id as sentencesTemplateId
         FROM MemeTemplate mt, SentencesTemplate st
         WHERE mt.id = st.templateId`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(rows);

            //Questo for per row mi permette di unire tutte le righe associate agli stessi meme e di creare per loro un unico oggetto
            //che sarà unito all'interno di 
            const memeTemplate = [];
            for (i = 0; i < rows.length; i++) {
                key = rows[i].id;
                //Uso findIndex cosi cerco solo sino a che non l'ho trovato, se lo trovo uno non serve continuare
                //Inoltre mi permetterà di modificare l'elemento del vettore
                elementIndex = memeTemplate.findIndex((m) => m.id === key);
                if (elementIndex !== -1) {
                    //Se find ritorna un elemento diverso da -1 significa che l'elemento è gia presente, per cui devo
                    //solo aggiornare il vettore delle frasi
                    memeTemplate[elementIndex] = {
                        ...memeTemplate[elementIndex],
                        sentences: [...memeTemplate[elementIndex].sentences, { id: rows[i].sentencesTemplateId, text: "", position: rows[i].position }]
                        //Aggiungo le nuove frasi
                    };
                } else {
                    //Nuovo elemento da aggiungere
                    memeTemplate.push({
                        id: rows[i].id,                  //Il meme è unico, anche se avro tante righe quante sono le sentences di ogni template, 
                        //prendiamo sempre il primo che deve esistere sempre
                        nome: rows[i].nome,
                        img: rows[i].img,
                        sentences: [{ id: rows[i].sentencesTemplateId, text: "", position: rows[i].position }]             //Aggiungo la prima frase che ho trovato
                    })
                }
            }
            resolve(memeTemplate);
        });
    });
};

exports.listMeme = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT m.id, m.title, m.visibility, m.color, m.font, m.templateId, 
        m.creatorId, c.username as creatorUsername, s.text, s.sentencesTemplateId, s.id as sentenceId
        FROM Meme m, Creators c, SentencesMeme s
        WHERE m.creatorId = c.id AND m.id = s.memeId AND s.sentencesTemplateId`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(rows);
            const meme = [];
            for (i = 0; i < rows.length; i++) {
                key = rows[i].id;
                //Uso findIndex cosi cerco solo sino a che non l'ho trovato, se lo trovo uno non serve continuare
                //Inoltre mi permetterà di modificare l'elemento del vettore
                elementIndex = meme.findIndex((m) => m.id === key);
                if (elementIndex !== -1) {
                    //Se find ritorna un elemento diverso da -1 significa che l'elemento è gia presente, per cui devo
                    //solo aggiornare il vettore delle frasi
                    meme[elementIndex] = {
                        ...meme[elementIndex],
                        sentences: [...meme[elementIndex].sentences, { id: rows[i].sentenceId, text: rows[i].text, position: "" }]
                        //Aggiungo le nuove frasi
                    };
                } else {
                    //Nuovo elemento da aggiungere
                    meme.push({
                        id: rows[i].id,                  //Il meme è unico, anche se avro tante righe quante sono le sentences di ogni template, 
                        //prendiamo sempre il primo che deve esistere sempre
                        title: rows[i].title,            //Stesso discors
                        visibility: rows[i].visibility,
                        color: rows[i].color,
                        font: rows[i].font,
                        templateId: rows[i].templateId,
                        creator: { id: rows[i].creatorId, username: rows[i].creatorUsername },
                        sentences: [{ id: rows[i].sentenceId, text: rows[i].text, position: "" }]             //Aggiungo la prima frase che ho trovato
                    })
                }
            }
            resolve(meme);
        });
    });
};

// get the meme identified by {id} -> To delete, update ecc
exports.getMemeByCreator = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT m.id, m.title, m.visibility, m.color, m.font, m.templateId, 
        m.creatorId, c.username as creatorUsername, s.text, s.sentencesTemplateId
        FROM Meme m, Creators c, SentencesMeme s
        WHERE m.creatorId = c.id AND m.id = s.memeId AND s.sentencesTemplateId AND c.id = ?`;
        db.all(sql, [userId] , (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(rows);
            const meme = [];
            for (i = 0; i < rows.length; i++) {
                key = rows[i].id;
                //Uso findIndex cosi cerco solo sino a che non l'ho trovato, se lo trovo uno non serve continuare
                //Inoltre mi permetterà di modificare l'elemento del vettore
                elementIndex = meme.findIndex((m) => m.id === key);
                if (elementIndex !== -1) {
                    //Se find ritorna un elemento diverso da -1 significa che l'elemento è gia presente, per cui devo
                    //solo aggiornare il vettore delle frasi
                    meme[elementIndex] = {
                        ...meme[elementIndex],
                        sentences: [...meme[elementIndex].sentences, { text: rows[i].text, position: "" }]
                        //Aggiungo le nuove frasi
                    };
                } else {
                    //Nuovo elemento da aggiungere
                    meme.push({
                        id: rows[i].id,                  //Il meme è unico, anche se avro tante righe quante sono le sentences di ogni template, 
                        //prendiamo sempre il primo che deve esistere sempre
                        title: rows[i].title,            //Stesso discors
                        visibility: rows[i].visibility,
                        color: rows[i].color,
                        font: rows[i].font,
                        templateId: rows[i].templateId,
                        creator: { id: rows[i].creatorId, username: rows[i].creatorUsername },
                        sentences: [{ text: rows[i].text, position: "" }]             //Aggiungo la prima frase che ho trovato
                    })
                }
            }
            resolve(meme);
        });
    });
};


// add a new meme, da verificare che sia loggato e fare VALIDAZIONE
exports.createMeme = (meme,userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Meme(title, visibility, color, font, templateId, creatorId) VALUES(?, ?, ?, ?, ?, ?)'
        db.run(sql, [ meme.title, meme.visibility, meme.color, meme.font, meme.templateId, userId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// add a new sentence
exports.createSentence = (sentence) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SentencesMeme(text, memeId, sentencesTemplateId) VALUES(?, ?, ?)'
        db.run(sql, [ sentence.text, sentence.memeId, sentence.sentencesTemplateId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// delete an existing exam
exports.deleteMeme = (memeId,userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Meme WHERE id = ? AND creator = ?';
        db.run(sql, [memeId,userId], function (err) {
            if (err || this.changes===0) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
}

// delete an existing sentence -> Qui non controllo lo user perchè viene chiamata insieme alla deleteMeme che lo controlla 
exports.deleteSentence = (sentenceId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SentencesMeme WHERE id = ? ';
        db.run(sql, [sentenceId], function (err) {
            if (err || this.changes===0) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
}

//Soluzione 3(Carico ogni tabella indipendentemente, troppo avoro da fare lato client, meme, memeTemplate, sentencesMeme, SentencesTemplate)