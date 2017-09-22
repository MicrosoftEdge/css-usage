function isVisible(element) {
    //checks if width/height = 0 and left/top < 0
    var rect = element.getBoundingClientRect();
    if (rect !== null) {
        var box = rect;
        var width = box.width;
        var height = box.height;
        var bottom = box.bottom;
        var right = box.right;
        if (width == 0 || height == 0 || bottom <= 0 || right <= 0) {
            return false;
        }
    }

    //checks for visibility with computed style
    var elStyle = getComputedStyle(element);
    if (elStyle.display === "none") {
        return false;
    }
    else if (elStyle.opacity < 0.1) {
        return false;
    }
    else if (elStyle.transform.scale == 0 || elStyle.transform.scaleX == 0 || elStyle.transform.scaleY == 0) {
        return false;
    }
    else if (elStyle.visibility != "visible") {
        return false;
    }

    // if text is within an iframe that does not appear
    var elAbove = element;
    do {
        if (elAbove.nodeName === "IFRAME" && !!element.closest("IFRAME")) {
            return false;
        }
        elAbove = elAbove.parentElement;
    } while (!!elAbove);
    return true;
}