const db = require('./db');

// Get all meme -> Meme is built from many table
exports.listMeme = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT m.id, m.title, mt.img, m.visibility, m.color, m.font, m.templateId, 
            c.id as creatorId, c.username as creatorUsername, st.position, s.text 
         FROM Meme m, MemeTemplate mt, Creators c, SentencesTemplate st, SentencesMeme s
         WHERE m.templateId = mt.id AND m.creatorId = c.id AND mt.id = st.templateId AND st.id = s.sentencesTemplateId`;
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
                        sentences: [...meme[elementIndex].sentences, { text: rows[i].text, position: rows[i].position }]  
                        //Aggiungo le nuove frasi
                    };

                } else {
                    //Nuovo elemento da aggiungere
                    meme.push({
                        id: rows[i].id,                  //Il meme è unico, anche se avro tante righe quante sono le sentences di ogni template, 
                                                         //prendiamo sempre il primo che deve esistere sempre
                        title: rows[i].title,            //Stesso discorso
                        img: rows[i].img,                //Stesso discorso
                        visibility: rows[i].visibility, 
                        color: rows[i].color,
                        font: rows[i].font,
                        templateId: rows[i].templateId,
                        creator: { id: rows[i].creatorId, username: rows[i].creatorUsername },
                        sentences: [{ text: rows[i].text, position: rows[i].position }]             //Aggiungo la prima frase che ho trovato
                    })
                }

            }

            resolve(meme);
        });
    });
};
