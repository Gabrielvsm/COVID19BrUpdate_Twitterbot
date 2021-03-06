const control = require('./casesControler');
const twitC = require('./twitControler');
let cases = {};
let updatedCases = {};

begin();

setInterval( () => {
    check('Brazil');
}, 1800000); //30min

async function check(country){

    if(await control.hasNewCases(country, cases)){
        await update(country);
        postUpdate();

        setTimeout(() => {
            postCurrentTotal();
        }, 300000); //5min
    } else {
        console.log('No new cases');
    }
}

function postUpdate(){
    let text = '';
    let hashtags = '\n\n#covid19 #COVID_19 #covid19brasil #coronavirusnobrasil';

    if(updatedCases.difTotal > 0){
        text = '\n' + `Mais ${updatedCases.difTotal} novo(s) caso(s) reportados no país.\nAgora com um total de ${cases.totalCases} casos, sendo ${cases.activeCases} casos ativos\n`;
        twitC.postTweet( text.concat(hashtags) );

        console.log('1');
    }
    if(updatedCases.difDeaths > 0){
        text = '\n' +`Mais ${updatedCases.difDeaths} óbito(s) devido ao vírus no país.\nAgora com um total de ${cases.deathCases} mortes.\n`;
        
        setTimeout(()=>{
            twitC.postTweet( text.concat(hashtags) );
        }, 120000); //2min

        console.log('2');
    }
    if(updatedCases.difRecovered > 0){
        text = '\n' +`Mais ${updatedCases.difRecovered} caso(s) de recuperação no país.\nAgora com um total de ${cases.recoveredCases} casos curados.\n`;

        setTimeout(()=>{
            twitC.postTweet( text.concat(hashtags) );
        }, 120000); //2min

        console.log('3');
    }
}

function postCurrentTotal(){
    let text = `Até agora temos no Brasil:\n\n-${cases.totalCases} casos confirmados\n-${cases.deathCases} mortes confirmadas\n-${cases.recoveredCases} casos de recuperação\n-${cases.activeCases} casos ativos`;
    let hashtags = '\n\n#covid19 #COVID_19 #covid19brasil #coronavirusnobrasil';

    text = text.concat(hashtags);
    
    twitC.postTweet(text);
}

async function update(country){
    let newCases = await control.getCases(country);
    
    updatedCases = {
        'difTotal': newCases.totalCases - cases.totalCases,
        'difActive': newCases.activeCases - cases.activeCases,
        'difCritical': newCases.criticalCases - cases.criticalCases,
        'difRecovered': newCases.recoveredCases - cases.recoveredCases,
        'difDeaths': newCases.deathCases - cases.deathCases
    }
    
    cases.totalCases += updatedCases.difTotal;
    cases.activeCases += updatedCases.difActive;
    cases.criticalCases += updatedCases.difCritical;
    cases.recoveredCases += updatedCases.difRecovered;
    cases.deathCases += updatedCases.difDeaths;

}

async function begin() {
    cases = await control.getCases('brazil');

    //postCurrentTotal();
}