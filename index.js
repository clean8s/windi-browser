import {StyleSheet} from 'windicss/utils/style';
import {Processor} from 'windicss/lib';

let processor = new Processor(undefined);

const generateName = (prefix) => `${prefix}${(Math.random() + 1).toString(36).substring(2)}`;

function styleGen(styleDict) {
    const final = (
        Object.values(styleDict).reduce(
            (previousValue, currentValue) =>
                previousValue.extend(currentValue),
            new StyleSheet()
        )
    );
    return final;
}

const styleToDOM = (prefix, stylesheet) => {
    let styleNode = document.getElementById(`${prefix}-style-node`)
    if (!styleNode) {
        styleNode = document.createElement("style");
        styleNode.id = `${prefix}-style-node`;
        document.head.append(styleNode)
    }
    styleNode.textContent = stylesheet.build(false);
}

function observe(node, prefix) {
    if(typeof prefix === 'undefined' || prefix == null) {
        prefix = 'windijit-';
    }

    const outputStyle = {};

    let calculateStyle = (node, prefix) => {
        let oldClassName = [...node.classList.values()].find(x => x.indexOf(prefix) == 0)
        if(!oldClassName) {
            oldClassName = generateName(prefix)
            node.classList.add(oldClassName)
        }
        var newStyle = processor.compile(node.getAttribute("class"), prefix, true, false, undefined, oldClassName)
        outputStyle[oldClassName] = newStyle.styleSheet;
    }

    [node, ...node.querySelectorAll('*[class]')].map(p => {
        calculateStyle(p, prefix)
    })

    const obs = new MutationObserver((mutations, observer) => {
        var nodes = [];
        mutations.forEach(value => {
            if (value.type === "attributes") {
                nodes.push(value.target);
            } else {
                nodes = [...nodes, ...value.addedNodes]
            }
        });

        [...new Set(nodes)].forEach(node => {
            calculateStyle(node, prefix);
        })

        const style = styleGen(outputStyle)
        styleToDOM(prefix, style)
    });
    obs.observe(node, {subtree: true, attributeFilter: ["class"], childList: true})

    const style = styleGen(outputStyle)
    styleToDOM(prefix, style)

    return () => {
        obs.disconnect()
    };
}
if(typeof IS_ESM === 'undefined') {
    document.addEventListener("DOMContentLoaded", () => observe(document.body))
}

export default observe;