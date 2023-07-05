const useRichText = () => {
  let selection: any = getSelection();
  let range: any = "";
  function insertHtmlAtCaret(html: any) {
    const el = document.createElement("div");
    el.innerHTML = html;
    let frag = document.createDocumentFragment(),
      node,
      lastNode;
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }

    range.deleteContents();
    range.insertNode(frag);
    if (lastNode) {
      range = range.cloneRange();
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  const initWelcomeText = (info: any, insertText: any) => {
    if (!info) return "";
    if (!insertText.length || (info?.length == 1 && info.indexOf("\\n"))) {
      return "";
    }
    let newText = info;
    for (const insertT of insertText) {
      const ins = `[${insertT}]`;
      if (info.indexOf(ins) >= 0) {
        newText = newText
          .split(ins)
          .join(
            `<span contenteditable='false' style="color: var(--wl-primary-color);" class='keyword'>${ins}</span>`
          );
      }
    }
    return newText;
  };
  const onContentInput = (e: any) => {
    selection = document.getSelection();
    range = selection.rangeCount ? selection.getRangeAt(0) : "";
    return e.target.innerText.trimEnd();
  };
  const onContentKeyUp = (insertTextList: any) => {
    selection = document.getSelection();
    if (selection.rangeCount) {
      const rangeAt: any = selection.getRangeAt(0);
      // 判断光标是否在插入内容 元素上
      const list = insertTextList.map((res: any) => `[${res}]`);
      if (!list.find((res: any) => res == rangeAt.startContainer.data)) {
        range = rangeAt;
      } else {
        range = "";
      }
    } else {
      range = "";
    }
  };
  const onInset = (text: any, contentDom: any) => {
    const newText = `[${text}]`;
    if (range) {
      insertHtmlAtCaret(
        `<span class='keyword' contenteditable='false' style="color: var(--wl-primary-color);">${newText}</span><span></span>&nbsp;`
      );
    } else {
      contentDom.innerHTML =
        contentDom.innerHTML +
        `<span class='keyword' contenteditable='false' style="color: var(--wl-primary-color);">${newText}</span><span></span>&nbsp;`;
    }
  };

  return {
    initWelcomeText,
    onContentInput,
    onContentKeyUp,
    onInset,
  };
};
export default useRichText;
