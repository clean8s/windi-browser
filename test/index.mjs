import jsdom from "jsdom"
const { JSDOM } = jsdom;

global.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
};

import observe from "../index.mjs"
import * as assert from "assert";

let dom = new JSDOM(`
<head></head>
<body>
    <div id="myel" class="w-[50%] bg-blue"></div>
</body>
`)

it("attribute added", (done) => {
    const [body, head] = [dom.window.document.body, dom.window.document.head];
    const myel = body.querySelector("#myel");
    assert.deepEqual([...myel.classList], ["w-[50%]", "bg-blue"])
    observe(body, "demo-", dom.window.document)
    assert.notDeepEqual([...myel.classList], ["w-[50%]", "bg-blue"])
    done();
})

it("css generated", (done) => {
    const [body, head] = [dom.window.document.body, dom.window.document.head];
    const myel = body.querySelector("#myel");
    observe(body, "demo-", dom.window.document)
    assert.match(head.innerHTML, /width/g)
    done();
})

it("reuse internal id", (done) => {
    const [body, head] = [dom.window.document.body, dom.window.document.head];
    const myel = body.querySelector("#myel");
    observe(body, "demo-", dom.window.document)
    const lastCls = myel.getAttribute("class")
    observe(body, "demo-", dom.window.document)

    assert.equal(lastCls, myel.getAttribute("class"))
    done();
})