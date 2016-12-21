const inputControl = (parentId, totalSelected, threshold) => {
  const parentNode = document.getElementById(parentId)
  const checkboxes = parentNode.querySelectorAll('input[type="checkbox"]')

  const disableUnchecked = (nodeArray) => {
    for (let i = 0; i < nodeArray.length; i++) {
      if (!nodeArray[i].checked) {
        nodeArray[i].setAttribute('disabled', true)
      }
    }
  }

  const enableAll = (nodeArray) => {
    for (let i = 0; i < nodeArray.length; i++) {
      nodeArray[i].removeAttribute('disabled')
    }
  }

  if (totalSelected >= threshold) {
    disableUnchecked(checkboxes)
  } else {
    enableAll(checkboxes)
  }
}

export { inputControl }