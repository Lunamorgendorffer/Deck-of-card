//constant qui stocke le time du moment de l'execution du code 
// c'est un number, le nombre de millisecondes (ms) depuis le 01/01/1970 0:00 UTC 
const timeStart = new Date().getTime();

//fonction qui renvoie le string contenant le nombre de millisecondes (ms) ecoulées depuis timeStart 
// La fonction getCurrMs() est définie synchrone, car elle n’appelle aucune fonction asynchrone et n’a donc rien besoin d’attendre.
function getCurrMs() {
    // la soustraction entre le timer actuel et timerStart nous donne le nonbre de ms ecoulées 
    return '[${new Date().getTime(); - timerStart} ms]'; 
}

//fonction async qui attend 1 seconde avant d'etre resolue (en succès) 
async function wait1Sec(){
    // log du timer au moment du debut de la fonction
    console.log(getCurrMs() + "wait1Sec -start");

    // retourne une promesse qui se resout d'elle même avec un succès apres 1 seconde 
    // note: l'appel a la fonction callback "resolve" signifie un succès, l'appel a reject signifie une erreur 
    return new Promise ((resolve, reject)=>
        //setTimeout permet d'executer la fonction fournie en 1er argument, apres une durée de [le 2eme argument] ms
        setTimeout(
            // 1er argument du setTimeout: definition de la fonction a executer apres un delai d'attente ( 2eme argument) 
            ()=>{
                //log du timer au momenT de l'execution de la fonction interne == la resolution et fin de wait1SEC5()
                console.log(getCurrMs() + "wait1Sec -start");
                /* appel à la fonction de callback de resolution (avec succès) de la promesse 
                l'argument passée ici (ok dans cas) sera la valeur recuperée par celui qui a appelé wait1Sec() et 
                attent (await). A la place d'un simple string, vous pouvez envoyer un tableau, objet, un JSON 
                Cet argument est l'equivalent du "return" d'une fonction synchrone */
                resolve ("Ok");
            }, 
            // 2eme argument du setTimeout: delai d'attente de 100ms == 1s
            1000
        )
    )
}

//fonction async qui appelle la fonction wait1Sec(), de manière sync ou async en fonction de l'argument (boolean) recu 
async function syncOrAsyncCallWait1Sec(isAsync){
    // log du timer au moment du debut de la fonction
    console.log(getCurrMs() + "syncOrAsyncCallWait1Sec -start");

    //en fonction de si l'appel à la fonction wait1Sec() doit être asynchrone ou synchrone 
    if (isAsync){
        //si asynchrone: appel et attendre de la resolution de la promessse grace à "await" 
        await wait1Sec(); 
    }else{
        //si synchrone: appel ( sans attendre la resolution de la promesse)
        wait1Sec();
    }
    console.log(getCurrMs() + "syncOrAsyncCallWait1Sec - end");
}