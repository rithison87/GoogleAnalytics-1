// checkbox disable/enable function definition
const checkboxDisableOnThreshold = (parentId, totalSelected, threshold) => {
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

const toggleDisabled = (elementId) => {
  const target = document.getElementById(elementId)
  const disabled = target => {
    if (target.getAttribute('disabled')) {
      return true
    } else {
      return false
    }
  }

  if (disabled) {
    target.removeAttribute('disabled')
  } else {
    target.setAttribute('disabled', true)
  }
}

// Enable a specific button if all required fields have a value
const conditionallyEnable = (elementId, conditionArray) => {
  console.log('conditionallyEnable called...')
  const target = document.getElementById(elementId)
  let condtionsMet = true

  for (let i = 0, l = conditionArray.length; i < l; i++) {
    console.log('condition value being evaluated: ' + conditionArray[i])
    if (conditionArray[i] === '' || !conditionArray[i]) {
      condtionsMet = false
      break
    }
  }

  console.log('condtionsMet value: ' + condtionsMet)

  if (condtionsMet) {
    // enable button
    console.log('enabling button "' + elementId + '"')
    target.removeAttribute('disabled')
  } else {
    // disable button
    console.log('disabling button "' + elementId + '"')
    target.setAttribute('disabled', true)
  }
}

export default conditionallyEnable
export {
  toggleDisabled,
  checkboxDisableOnThreshold
}
