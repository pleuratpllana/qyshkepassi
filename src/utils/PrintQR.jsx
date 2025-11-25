export const printElement = (element, networkName, password, security) => {
    if (!element) return;
  
    const originalChildren = Array.from(document.body.children).filter(el => el !== element);
    originalChildren.forEach(el => (el.style.display = "none"));
  
    const originalStyles = element.style.cssText;
    element.style.position = "fixed";
    element.style.top = "0";
    element.style.left = "0";
    element.style.width = "100%";
    element.style.height = "100%";
    element.style.backgroundColor = "white";
    element.style.display = "flex";
    element.style.flexDirection = "column";
    element.style.alignItems = "center";
    element.style.justifyContent = "center";
    element.style.zIndex = "9999";
    element.style.padding = "20px";
  
    const info = document.createElement("div");
    info.innerHTML = `
      <h2>${networkName} QR Code</h2>
      ${security ? `<p><strong>Security:</strong> ${security}</p>` : ""}
      ${password ? `<p><strong>Password:</strong> ${password}</p>` : ""}
    `;
    element.prepend(info);
  
    window.print();
  
    originalChildren.forEach(el => (el.style.display = ""));
    element.style.cssText = originalStyles;
    element.removeChild(info);
  };
  