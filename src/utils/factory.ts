export const createInputProp = (label: string) => {
    return {
        type: 'input',
        label,
    }
}

export const createInputNumberProp = (label: string) => {
    return {
        type: 'inputNumber',
        label,
    }
}

export const createColorProp = (label: string) => {
    return {
        type: 'color',
        label,
    }
}

export const createSelectProp = (label: string, options: { label: string, value: string }[]) => {
    return {
        type: 'select',
        label,
        options
    }
}
