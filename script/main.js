// fonction qui fait le fetch (), qui contact l'api
async function callAPI (uri){
    console.log ("-- callApi - start -- ");
    console.log ( "uri=", uri);
    
    try{
        //fetch(), appel à l'API et reception de la reponse 
        const response = await fetch (uri);
        console.log ( "reponse = ", response);
        /* La propriété ok fait partie de l'interface Response de l'API Fetch en JavaScript. 
        Elle indique si la requête HTTP a été effectuée avec succès. 
        response.ok est un boolean qui est true si le statut de la réponse HTTP est compris entre 200 et 299, 
        indiquant ainsi une requête réussie.*/

        // Vérifie si la réponse est correcte (statut entre 200 et 299)
        if (!response.ok){
            // Si la réponse n'est pas correcte, déclenche une erreur
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // recupartaion des donnes JSON de l'api 
        const data = await response.json();
        console.log ( "data = ", data);
        console.log ("-- callApi - end -- ");
        //renvoi des données
        return data; 
    } catch (error){
        // Si une erreur survient, elle est capturée ici
        console.error("Error during API call:", error);
         // Affiche un message d'erreur à l'utilisateur
        displayErrorMessage("An error occurred while contacting the server. Please try again later.");
        throw error; // Relance l'erreur pour qu'elle soit gérée ailleurs
    }

}

//Constant globale : l'uri du endpoint de demande de nuveau deck
const API_ENDPOINT_NEW_DECK= "https://www.deckofcardsapi.com/api/deck/new/";

// fonction de demande de nouveau deck 
async function getNewDeck(){
    console.log ( ">> getNewDeck ");

    return await callAPI ( API_ENDPOINT_NEW_DECK );
}

// variable gobale: l'id du deck utilisé, dans lequel on picohe 
let idDeck = null; 

// fonction qui renvoient des URI dynamique de demande de melande du deck et de pioche 
const getApiEndpointShuffleDeck= () =>`https://www.deckofcardsapi.com/api/deck/${idDeck}/shuffle/`;

//fonction de demande de melange deck
async function shuffleDeck(){
    console.log ( ">> shuffleDeck ");

    return await callAPI (getApiEndpointShuffleDeck());
}

// fonction qui renvoient des URI dynamique de demande de melande du deck et de pioche 
const getApiEndpointDrawCard= () =>`https://www.deckofcardsapi.com/api/deck/${idDeck}/draw/?count=1`;

//fonction de demande de picohe deck
async function drawCard(){
    console.log ( ">> drawCard ");

    return await callAPI(getApiEndpointDrawCard());
}

//supprime les cartes de l'ancien deck du DOM 
const cleanDomCardsFromPreviousDeck = () =>
    // recuperation de cartes 
    document.querySelectorAll(".card")
    //et pour chacune de ces cartes 
    .forEach ((card)=>
    //suppression du DOM
     card.remove ()
    )
;

// Cette fonction affiche un message d'erreur dans l'interface utilisateur
function displayErrorMessage(message) {
    // Sélectionne l'élément HTML pour afficher les erreurs
    const errorContainer = document.getElementById("error-container");
    // Définit le texte de l'erreur
    errorContainer.innerText = message;
    // Affiche l'élément d'erreur en dislay block 
    errorContainer.style.display = "block";
}

// Cette fonction cache le message d'erreur
function hideErrorMessage() {
    // Sélectionne l'élément HTML pour afficher les erreurs
    const errorContainer = document.getElementById("error-container");
    // Vide le texte de l'erreur
    errorContainer.innerText = ""; 
    // Cache l'élément d'erreur
    errorContainer.style.display = "none"; 
}

// fonction de reinitialisation ( demande de nouveau deck + demande de melange de ce nouveau deck)
async function actionReset() {
    // Cache les messages d'erreur précédents
    hideErrorMessage();
    //vider dans le DOM les cartes de l'ancien deck
    cleanDomCardsFromPreviousDeck ();
    try {
        //recuperation d'un nouveau deck
        const newDeckResponse = await getNewDeck();
    
        //recuperation de l'id de ce nouveau deck dans les données recues et maj de la variable globale 
        idDeck = newDeckResponse.deck_id;
        
        //melange du deck
        await shuffleDeck();
    } catch (error) {
        // Affiche une erreur si quelque chose ne va pas
        console.error("Error in actionReset:", error);
    }


}

//elements HTML utiles pour les evenements et pour la manipulation du DOM 
const cardsContainer = document.getElementById("cards-container"); 

//ajoute une carte dans le DOM d'apres l'Uri de son image 
function addCardtoDomByImgUri(imgUri){
    //creation de l'element HTM "img", de class CSS "card" et avec pour attribut HTML "src" l'URI recue en argument 
    const imgCardHtmlElement = document.createElement("img");
    imgCardHtmlElement.classList.add("card");
    imgCardHtmlElement.src = imgUri;

    //ajout de cette image dans ma zone de cartes piochées
    cardsContainer.append(imgCardHtmlElement);

}

//fonction qui demande à picoher une carte puis qui fait l'appel pour l'integrer dan sle DOM 
async function actionDraw(){
   // Cache les messages d'erreur précédents
    hideErrorMessage();
    try {
        //appel à l'api pour demander au coupier de picoher une carte et de nous la renvoyer 
        const drawCardResponse = await drawCard ();
    
        console.log ("drawCardResponse =", drawCardResponse);
    
        //recuperation de m'uri de l'image de cette carte dans les données recues 
        const imgCardUri = drawCardResponse.cards[0].image;
    
        //ajout de la carte piochée dans la zone des cartes piochées 
        addCardtoDomByImgUri(imgCardUri);
    } catch (error) {
        console.error("Error in actionDraw:", error);
    }
}

//appel d'initialisation au lancement de l'application 
actionReset();

// elements HTML utiles pour les evenemen et pour manipulation du DOM 
const actionResetButton = document.getElementById("action-reset"); 
const actionDrawButton = document.getElementById ("action-draw");

// Ajoute un événement de clic au bouton de réinitialisation pour appeler la fonction actionReset
actionResetButton.addEventListener ("click",actionReset);
// Ajoute un événement de clic au bouton de pioche pour appeler la fonction actionDraw
actionDrawButton.addEventListener ("click",actionDraw);
