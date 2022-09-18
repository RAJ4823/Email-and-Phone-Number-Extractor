import * as script from "./script.js";

window.onload = async () => {
    //Execute getData() after page load
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({ target: { tabId: tab.id }, function: getData });

    //Set selected mode & update some styles
    script.selectMode();
    //update information on popup screen
    chrome.runtime.onMessage.addListener(data => script.updatePopup(data[localStorage.getItem('mode')]));
    // get emails and send them to extension 

    function getData() {
        const body = document.querySelector('body');
        const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/gi;
        const phoneRegex1 = /\+\d{1,4}\s?\(?\d{1,2}\)?(?:\s?\-?\d{1,3}){3,5}/gi; //For international numbers
        const phoneRegex2 = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/gi; //For indian numbers (telephone/landline)
        let textNode, emails = [], phones = [];
        let ele = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
        while (textNode = ele.nextNode()) {
            let foundEmail = textNode.textContent.match(emailRegex);
            let foundPhone1 = textNode.textContent.match(phoneRegex1);
            let foundPhone2 = textNode.textContent.match(phoneRegex2)

            if (foundEmail) emails = [...emails, ...foundEmail];
            if (foundPhone1) phones = [...phones, ...foundPhone1];
            if (foundPhone2) phones = [...phones, ...foundPhone2];
        }
        emails = [...new Set(emails)];
        phones = [...new Set(phones)];
        //send data
        chrome.runtime.sendMessage({ emails, phones });
    }
}
