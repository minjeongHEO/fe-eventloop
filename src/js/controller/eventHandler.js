import { formId, textId, selectorsMap, delay } from "../util/constants.js";
import { extractCallbackCode } from "../model/acornParser.js";
import { Memory } from "../model/memory.js";
import { removeMatchingElement, appendTag, addQueueAnimation } from "../view/components.js";

const DELAY_TIME = 2700

const createParseCode = () => {
    const userCode = document.getElementById(textId).value;
    const parseCode = acorn.parse(userCode, { sourceType: "module" });
    document.getElementById(textId).value = null;
    return [parseCode, userCode];
};

export const addEventHandler = () => {
    document.getElementById(formId).addEventListener("submit", handleFormSubmit);
};

const handleFormSubmit = (e) => {
    e.preventDefault();
    const [parseCode, userCode] = createParseCode();
    const nodeList = parseCode.body.map((obj) => extractCallbackCode(obj, userCode)).flat();
    eventLoopControl(nodeList)
};

const checkQueue = (callBack) => {
    if (callBack.type === "setTimeout") return [selectorsMap.macroQClassName, callBack.delay]
    return [selectorsMap.microQClassName]
}

const setTaskQueues = async(callBack, memory) => {
    const [queueName, delayTime] = checkQueue(callBack)
    await delay(delayTime)
    removeMatchingElement(callBack, selectorsMap.webAPIClassName, memory);
    appendTag(callBack, queueName, memory);
}

const processQueueNode = async (queueNode, fromQueue, toQueue, memory) => {
    removeMatchingElement(queueNode, fromQueue, memory);
    appendTag(queueNode, toQueue, memory, fromQueue);
    await delay(DELAY_TIME);
    removeMatchingElement(queueNode, toQueue, memory);
};

const eventLoop = async (memory) => {
    const { microQClassName, macroQClassName, callStackClassName } = selectorsMap;  
    while (!memory.isEmpty(selectorsMap.microQClassName)) {
        const queueNode = memory.getCallBack(selectorsMap.microQClassName);
        await addQueueAnimation(selectorsMap.microQClassName)
        await processQueueNode(queueNode, microQClassName, callStackClassName, memory);  
    }
    const queueNode = memory.getCallBack(selectorsMap.macroQClassName);
    await addQueueAnimation(selectorsMap.macroQClassName)
    await processQueueNode(queueNode, macroQClassName, callStackClassName, memory);  
};


const eventLoopControl = async (nodeList) => {
    const memory = new Memory()
    for (const callBack of nodeList) {
        appendTag(callBack, selectorsMap.callStackClassName, memory);
        await delay(DELAY_TIME)
        removeMatchingElement(callBack, selectorsMap.callStackClassName, memory)
        appendTag(callBack, selectorsMap.webAPIClassName, memory);
        await delay(DELAY_TIME)
        setTaskQueues(callBack, memory);
    }
    eventLoop(memory);
};

export {createParseCode, handleFormSubmit, checkQueue}