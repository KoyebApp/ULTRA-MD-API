const { 
  pShadow,
  pRomantic,
  pSmoke,
  pBurnPapper,
  pNaruto,
  pLoveMsg,
  pMsgGrass,
  pGlitch,
  pDoubleHeart,
  pCoffeCup,
  pLoveText,
  pButterfly 
} = require('./lib/utils/photooxy'); // Replace with the correct path to your module

// Example test data
const testData = {
  shadowText: "Shadow Effect Text",
  romanticText: "I love you",
  smokeText: "Smoke Effect Text",
  burnPapperText: "Burnt Paper Text",
  narutoText: "Naruto Banner Text",
  loveMsgText: "Love Message",
  msgGrassText: "Grass Text",
  glitchText1: "TikTok",
  glitchText2: "Effect",
  doubleHeartText: "Love Heart Text",
  coffeCupText: "Coffee Text",
  loveTextText: "Love Text Effect",
  butterflyText: "Butterfly Effect Text"
};

// Testing each function
async function runTests() {
  try {
    console.log("Testing pShadow...");
    const shadowResult = await pShadow(testData.shadowText);
    console.log("pShadow result:", shadowResult);

    console.log("Testing pRomantic...");
    const romanticResult = await pRomantic(testData.romanticText);
    console.log("pRomantic result:", romanticResult);

    console.log("Testing pSmoke...");
    const smokeResult = await pSmoke(testData.smokeText);
    console.log("pSmoke result:", smokeResult);

    console.log("Testing pBurnPapper...");
    const burnPapperResult = await pBurnPapper(testData.burnPapperText);
    console.log("pBurnPapper result:", burnPapperResult);

    console.log("Testing pNaruto...");
    const narutoResult = await pNaruto(testData.narutoText);
    console.log("pNaruto result:", narutoResult);

    console.log("Testing pLoveMsg...");
    const loveMsgResult = await pLoveMsg(testData.loveMsgText);
    console.log("pLoveMsg result:", loveMsgResult);

    console.log("Testing pMsgGrass...");
    const msgGrassResult = await pMsgGrass(testData.msgGrassText);
    console.log("pMsgGrass result:", msgGrassResult);

    console.log("Testing pGlitch...");
    const glitchResult = await pGlitch(testData.glitchText1, testData.glitchText2);
    console.log("pGlitch result:", glitchResult);

    console.log("Testing pDoubleHeart...");
    const doubleHeartResult = await pDoubleHeart(testData.doubleHeartText);
    console.log("pDoubleHeart result:", doubleHeartResult);

    console.log("Testing pCoffeCup...");
    const coffeCupResult = await pCoffeCup(testData.coffeCupText);
    console.log("pCoffeCup result:", coffeCupResult);

    console.log("Testing pLoveText...");
    const loveTextResult = await pLoveText(testData.loveTextText);
    console.log("pLoveText result:", loveTextResult);

    console.log("Testing pButterfly...");
    const butterflyResult = await pButterfly(testData.butterflyText);
    console.log("pButterfly result:", butterflyResult);

  } catch (error) {
    console.error("Test failed with error:", error);
  }
}

// Run tests
runTests();
