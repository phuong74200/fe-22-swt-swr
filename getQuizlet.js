async function quizlet(id){
    return await fetch(`https://quizlet.com/webapi/3.4/studiable-item-documents?filters%5BstudiableContainerId%5D=${id}&filters%5BstudiableContainerType%5D=1&perPage=500&page=1`).then(res => res.json())
}

const e = await quizlet(788304122)

console.log(e.responses[0].models.studiableItem.map(e => e.cardSides[0].media[0].plainText + " | " + e.cardSides[1].media[0].plainText).join('<split>'))