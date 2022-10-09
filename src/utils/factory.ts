export const createPropGroup = (label: string, props: any) => {
    return {
        type: "group",
        label,
        props
    }
}

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

export const createSelectProp = (label: string, options: { label: string, value: any }[]) => {
    return {
        type: 'select',
        label,
        options
    }
}

export const createFontsizeSelect = (label: string) => {
    return createSelectProp(label, [
        { label: "12px", value: 12 },
        { label: "14px", value: 14 },
        { label: "16px", value: 16 },
        { label: "18px", value: 18 },
        { label: "20px", value: 20 },
        { label: "24px", value: 24 },
        { label: "28px", value: 28 },
        { label: "32px", value: 32 },
    ])
}